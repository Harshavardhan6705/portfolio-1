'use client';

/**
 * Portfolio-wide SCROLL-SPEED motion coordinator.
 *
 * ONE window 'scroll'/'resize' listener pair + ONE rAF loop drive ALL
 * registered elements. Motion is driven by SCROLL SPEED:
 *
 *   • Slow scrolling  → elements barely move, no blur.
 *   • Fast scrolling  → elements drift further in the scroll direction
 *     and pick up a matching motion blur.
 *   • Scrolling stops → speed decays to zero and every element springs
 *     back to its natural, sharp position (the "pop").
 *
 * Blur follows scroll speed directly on its own fast spring (it does not
 * wait for the drift), so it appears and clears quickly. Blur is applied
 * only to the OUTERMOST registered element of a nested group so it never
 * stacks. Each element's `strength` is its max drift in px at full speed
 * (scaled down on mobile).
 *
 * Environment-hardened design:
 *  - Speed is measured from scrollY deltas over real time and smoothed,
 *    so wheel ticks, trackpads and touch flings all feel consistent.
 *  - A cheap fallback interval catches scrolls whose events are
 *    suppressed in occluded/backgrounded window states.
 *  - All element reads are batched before any write; writes are
 *    transform/filter only — zero layout shift. The loop auto-stops
 *    once everything is settled, so idle cost is zero.
 */

const registrations = new Set();
let listening = false;
let syncTimer = 0;
let frameId = 0;
let loopRunning = false;
let lastKnownScrollY = -1;
let lastScrollTime = 0;
let velocity = 0; // smoothed scroll speed, px per ms (+ down, − up)
let mobileQuery = null;
let reducedQuery = null;

const FULL_SPEED = 2.5;       // px/ms treated as "full speed" (a fast flick)
const SPEED_SMOOTHING = 0.63; // weight of each new speed sample (higher = snappier)
const SPEED_DECAY = 0.66;     // per-frame speed decay once scrolling stops
const IDLE_MS = 40;           // no scroll event for this long → decaying
const EASE = 0.27;            // per-frame spring factor for the drift
const MAX_STEP = 11;          // max px per frame — keeps big jumps smooth
const SETTLE_EPSILON = 0.1;   // px — below this the drift snaps and stops
const DRIFT_MULT = 1.6;       // strength × this = drift at full speed
const MAX_BLUR = 3;           // px of blur at full speed
const BLUR_EASE = 0.63;       // per-frame spring factor for the blur (fast)
const MIN_BLUR = 0.25;        // below this blur is removed entirely
// Vertical window (fractions of the viewport height) in which elements
// participate. Off-screen elements are left untouched.
const BAND_TOP_F = -0.25;
const BAND_BOTTOM_F = 1.25;

function ensureQueries() {
  if (typeof window === 'undefined') return false;
  if (!mobileQuery) {
    mobileQuery = window.matchMedia('(max-width: 640px)');
    reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  }
  return true;
}

/** The single rAF loop: speed → targets → springs → transform + blur. */
function loop() {
  const now = performance.now();
  const scrolling = now - lastScrollTime < IDLE_MS;
  if (!scrolling) velocity *= SPEED_DECAY;
  if (Math.abs(velocity) < 0.005) velocity = 0;

  const vh = window.innerHeight || document.documentElement.clientHeight;
  const bandTop = vh * BAND_TOP_F;
  const bandBottom = vh * BAND_BOTTOM_F;
  const scale = mobileQuery && mobileQuery.matches ? 0.45 : 1;
  const intensity = Math.min(1, Math.abs(velocity) / FULL_SPEED);
  // Scrolling down → drift up (negative); scrolling up → drift down.
  const dir = velocity > 0 ? -1 : 1;

  // Batch ALL reads before ANY write.
  const states = [];
  registrations.forEach((reg) => {
    if (!reg.el.isConnected) return;
    const box = reg.el.getBoundingClientRect();
    states.push({ reg, inBand: box.bottom > bandTop && box.top < bandBottom });
  });

  let allSettled = true;
  states.forEach(({ reg, inBand }) => {
    // Drift spring
    const maxDrift = reg.strength * scale * DRIFT_MULT;
    const target = inBand ? dir * intensity * maxDrift : 0;
    const cur = reg.current;
    if (target !== cur) {
      const raw = (target - cur) * EASE;
      const step = Math.max(-MAX_STEP, Math.min(MAX_STEP, raw));
      reg.current = Math.abs(target - (cur + step)) < SETTLE_EPSILON ? target : cur + step;
      reg.el.style.transform = reg.current === 0 ? '' : `translate3d(0, ${reg.current.toFixed(2)}px, 0)`;
    }
    if (reg.current !== 0) allSettled = false;

    // Blur spring — tracks speed directly, so it reacts faster than the drift
    if (reg.blurs) {
      const blurTarget = inBand ? intensity * MAX_BLUR : 0;
      reg.blur += (blurTarget - reg.blur) * BLUR_EASE;
      if (reg.blur < MIN_BLUR && blurTarget < MIN_BLUR) reg.blur = 0;
      const next = reg.blur >= MIN_BLUR ? `blur(${reg.blur.toFixed(2)}px)` : '';
      if (reg.el.style.filter !== next) reg.el.style.filter = next;
      if (reg.blur !== 0) allSettled = false;
    }
  });

  if (allSettled && velocity === 0 && !scrolling) {
    loopRunning = false;
    frameId = 0;
    return;
  }
  frameId = requestAnimationFrame(loop);
}

function ensureLoop() {
  if (loopRunning) return;
  loopRunning = true;
  frameId = requestAnimationFrame(loop);
}

function onScroll() {
  if (reducedQuery && reducedQuery.matches) return;
  const y = window.scrollY;
  const now = performance.now();
  const dt = Math.min(100, Math.max(8, now - lastScrollTime));
  const dy = y - lastKnownScrollY;

  if (dy !== 0) {
    const sample = dy / dt;
    velocity = velocity * (1 - SPEED_SMOOTHING) + sample * SPEED_SMOOTHING;
    lastKnownScrollY = y;
  }
  lastScrollTime = now;
  ensureLoop();
}

function startListening() {
  if (listening || !ensureQueries()) return;
  listening = true;
  lastKnownScrollY = window.scrollY;
  lastScrollTime = performance.now();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', ensureLoop, { passive: true });

  // Fallback pump for window states that suppress scroll EVENTS.
  syncTimer = setInterval(() => {
    if (window.scrollY !== lastKnownScrollY) onScroll();
  }, 120);
}

function stopListeningIfIdle() {
  if (registrations.size > 0 || !listening) return;
  listening = false;
  window.removeEventListener('scroll', onScroll);
  window.removeEventListener('resize', ensureLoop);
  if (syncTimer) {
    clearInterval(syncTimer);
    syncTimer = 0;
  }
  if (frameId) {
    cancelAnimationFrame(frameId);
    frameId = 0;
  }
  loopRunning = false;
  velocity = 0;
}

/**
 * Register one motion element.
 *
 * reg = { el, strength } — el receives translate3d (+ blur when it is
 * the outermost registered element); strength is its max px drift at
 * full scroll speed (scaled to 45% on mobile).
 *
 * Returns an unregister function.
 */
export function registerPop(reg) {
  if (!reg || !reg.el) return () => {};
  ensureQueries();
  if (reducedQuery && reducedQuery.matches) return () => {};

  // Blur only the outermost wrapper of a nested group so blur never stacks.
  const blurs = !reg.el.parentElement?.closest('.pop-motion');
  const entry = { ...reg, current: 0, blur: 0, blurs };
  registrations.add(entry);
  startListening();

  return () => {
    registrations.delete(entry);
    entry.el.style.transform = '';
    entry.el.style.filter = '';
    entry.current = 0;
    entry.blur = 0;
    stopListeningIfIdle();
  };
}

/** Kick the loop (e.g. after mount or viewport changes). */
export function refreshPop() {
  ensureLoop();
}
