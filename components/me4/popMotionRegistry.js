'use client';

/**
 * Portfolio-wide POP MOTION coordinator.
 *
 * ONE window 'scroll'/'resize' listener pair + ONE rAF settle loop drive
 * ALL registered elements. Direction-driven behavior (per the design):
 *
 *   • Scrolling DOWN → every element drifts ↑ UP toward its exit edge
 *     (the viewport top), then
 *   • Scrolling UP → every element drifts ↓ DOWN toward its exit edge
 *     (the viewport bottom), and
 *   • The moment scrolling stops, every element springs back to its
 *     natural position (the "pop").
 *
 * How much each element moves depends on how close it is to the exit
 * edge in the CURRENT direction — elements near the edge they are
 * leaving through move the most, elements near the center barely move.
 * This creates the layered "pop" feel for all text and pictures.
 *
 * Environment-hardened design:
 *  - rAF settle loop with speed clamping: small wheel ticks pop gently,
 *    big jumps (nav links, keyboard, drag) catch up quickly. The loop
 *    auto-stops when everything is settled, so idle cost is zero.
 *  - Direct synchronous compute on every scroll event so the first
 *    frame after a scroll tick is already correct.
 *  - A cheap fallback interval recomputes only when scrollY changed:
 *    some occluded/backgrounded window states suppress scroll EVENTS
 *    entirely (the page scrolls, JS never hears about it).
 *  - Synchronous viewport-band activation instead of
 *    IntersectionObserver: observer callbacks run on the rendering
 *    pipeline and can also be starved after large programmatic jumps.
 *  - All element reads are batched before any write (one layout pass
 *    per scroll event); writes are transforms only — zero layout shift.
 */

const registrations = new Set();
let listening = false;
let syncTimer = 0;
let frameId = 0;
let settleLoopRunning = false;
let lastKnownScrollY = -1;
let lastScrollTime = 0;
// 'down' | 'up' | null — null until the first scroll event.
let direction = null;
let mobileQuery = null;
let reducedQuery = null;

const EASE = 0.16;          // per-frame spring factor of the settle loop
const SETTLE_EPSILON = 0.1; // px — below this we snap and stop
const MAX_SPEED = 6.5;      // max px per frame — huge jumps still land fast
const IDLE_MS = 90;         // "scrolling has stopped" threshold
// Vertical window (fractions of the viewport height) in which elements
// participate. Generous so pops start just before elements scroll in.
const BAND_TOP_F = -0.25;
const BAND_BOTTOM_F = 1.25;
// Progress at the exit edge maps to this fraction of the viewport height.
const MAX_SPAN_F = 0.9;

function ensureQueries() {
  if (typeof window === 'undefined') return false;
  if (!mobileQuery) {
    mobileQuery = window.matchMedia('(max-width: 640px)');
    reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  }
  return true;
}

/** Update every element's target offset for the current scroll state. */
function computeAll() {
  if (reducedQuery && reducedQuery.matches) return;
  if (registrations.size === 0) return;

  const vh = window.innerHeight || document.documentElement.clientHeight;
  const bandTop = vh * BAND_TOP_F;
  const bandBottom = vh * BAND_BOTTOM_F;
  const maxSpan = vh * MAX_SPAN_F;
  const scale = mobileQuery && mobileQuery.matches ? 0.45 : 1;
  const dir = direction === 'up' ? 1 : -1; // 'down' drifts up (negative), 'up' drifts down

  // Batch ALL reads before ANY write — one layout pass per scroll event.
  const measurements = [];
  registrations.forEach((reg) => {
    const el = reg.el;
    if (!el.isConnected) return;
    const box = el.getBoundingClientRect();
    const inBand = box.bottom > bandTop && box.top < bandBottom;

    // Distance remaining to the exit edge in the CURRENT direction.
    // Scrolling down → the element exits through the TOP edge.
    // Scrolling up   → it exits through the BOTTOM edge.
    // Edge case (no direction yet): treat like 'down'.
    const travel = dir < 0
      ? Math.max(0, box.top - bandTop)
      : Math.max(0, bandBottom - box.bottom);

    // 0 at viewport center (no motion) → 1 at the exit edge (full pop).
    const progress = Math.min(1, travel / maxSpan);
    measurements.push({ reg, box, inBand, progress });
  });

  // Then write: raise each element's spring target (the settle loop
  // animates current → target, giving the motion its pop feel).
  measurements.forEach(({ reg, box, inBand, progress }) => {
    if (!inBand) {
      // Out of view: neutral target — spring handles the glide back.
      reg.target = 0;
      return;
    }
    reg.target = +(progress * reg.strength * scale * dir).toFixed(2);
  });

  ensureSettleLoop();
}

/**
 * The single rAF spring loop. Animates every element's current offset
 * toward its target and — the signature of the pop motion — keeps
 * running briefly after scrolling stops so everything springs back to
 * 0. Auto-stops when all elements are settled and no scroll is active.
 */
function settleLoop() {
  const now = performance.now();
  const scrollingRecently = now - lastScrollTime < IDLE_MS;

  // While the user keeps scrolling, refresh targets so the direction
  // flip (down ↔ up) re-aims every element on the very next frame.
  if (scrollingRecently) computeAll();

  let allSettled = true;

  registrations.forEach((reg) => {
    const el = reg.el;
    if (!el || !el.isConnected) return;

    // The "pop": the moment scrolling stops, every element springs back
    // to its natural position — the rest state is never displaced.
    if (!scrollingRecently) reg.target = 0;

    const cur = reg.current;
    const target = reg.target;

    if (target !== cur) {
      const rawStep = (target - cur) * EASE;
      // Clamp per-frame speed so huge jumps (nav links, keyboard,
      // drag) still land quickly and smoothly.
      const step = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, rawStep));
      const next = Math.abs(target - (cur + step)) < SETTLE_EPSILON
        ? target
        : cur + step;
      reg.current = next;
      el.style.transform = `translate3d(0, ${next.toFixed(2)}px, 0)`;
    }

    if (Math.abs(reg.target - reg.current) >= SETTLE_EPSILON) {
      allSettled = false;
    }
  });

  if (allSettled && !scrollingRecently) {
    // Everything is back at rest — park the loop (zero idle cost).
    settleLoopRunning = false;
    frameId = 0;
    return;
  }
  frameId = requestAnimationFrame(settleLoop);
}

function ensureSettleLoop() {
  if (settleLoopRunning) return;
  settleLoopRunning = true;
  frameId = requestAnimationFrame(settleLoop);
}

function onScroll() {
  const y = window.scrollY;
  const now = performance.now();

  if (y !== lastKnownScrollY) {
    direction = y > lastKnownScrollY ? 'down' : 'up';
    lastKnownScrollY = y;
  }
  // Refresh the activity timestamp even for same-position scroll events
  // (momentum tails, elastic overscroll) so the spring keeps chasing.
  lastScrollTime = now;

  computeAll();
}

function startListening() {
  if (listening || !ensureQueries()) return;
  listening = true;
  lastKnownScrollY = window.scrollY;
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  // Fallback pump: some occluded/backgrounded window states suppress
  // scroll EVENTS entirely (the page scrolls, JS never hears about it).
  // A cheap interval recomputes only when scrollY actually changed —
  // reading scrollY does not force layout, so idle cost is negligible.
  syncTimer = setInterval(() => {
    const y = window.scrollY;
    if (y !== lastKnownScrollY) onScroll();
  }, 120);
}

function stopListeningIfIdle() {
  if (registrations.size > 0 || !listening) return;
  listening = false;
  window.removeEventListener('scroll', onScroll);
  window.removeEventListener('resize', onScroll);
  if (syncTimer) {
    clearInterval(syncTimer);
    syncTimer = 0;
  }
  if (frameId) {
    cancelAnimationFrame(frameId);
    frameId = 0;
  }
  settleLoopRunning = false;
}

/**
 * Register one pop-motion element.
 *
 * reg = { el, strength } — el receives translate3d; strength is the max
 * px drift at its exit edge (scaled to 45% on mobile by the pump).
 *
 * Returns an unregister function.
 */
// Scroll pop motion is switched off site-wide: nothing registers, so no
// element is ever translated while scrolling.
const POP_MOTION_ENABLED = false;

export function registerPop(reg) {
  if (!POP_MOTION_ENABLED || !reg || !reg.el) return () => {};
  ensureQueries();
  if (reducedQuery && reducedQuery.matches) return () => {};

  const entry = { ...reg, target: 0, current: 0 };
  registrations.add(entry);
  startListening();

  // Compute the initial position on the next tick (timers survive in
  // environments where rAF/observer callbacks are throttled).
  const initialTimer = setTimeout(() => computeAll(), 30);

  return () => {
    clearTimeout(initialTimer);
    registrations.delete(entry);
    entry.el.style.transform = '';
    entry.current = 0;
    entry.target = 0;
    stopListeningIfIdle();
  };
}

/** Recompute everything (e.g. after mount or viewport changes). */
export function refreshPop() {
  computeAll();
}
