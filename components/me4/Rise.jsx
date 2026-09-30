'use client';

import React, { useEffect, useRef, useState } from 'react';

/**
 * Rise — Canva-style entrance animation for a single element.
 *
 * The element starts slightly below its final position (translateY(35px))
 * and fully transparent, then smoothly RISES upward into place:
 *
 *   BEFORE:  element sits 35px low, opacity 0
 *   DURING:  ↑ ↑ smoothly rises
 *   AFTER:   element at final position, opacity 1
 *
 * Trigger architecture (same hardened design as popMotionRegistry):
 * ONE shared window 'scroll'/'resize' listener pair + a cheap fallback
 * pump synchronously measure every registered element's bounding rect.
 * IntersectionObserver was deliberately NOT used — observer callbacks
 * run on the rendering pipeline and can be starved indefinitely in
 * occluded/backgrounded windows or after large programmatic jumps,
 * leaving content permanently invisible. A synchronous band check
 * cannot be starved.
 *
 * Behavior:
 *  - Every element triggers INDEPENDENTLY off its own rect — elements
 *    never animate as a synchronized group, and jumping straight to a
 *    later item still animates it normally.
 *  - Per Canva's "Both" mode the trigger re-arms when the element
 *    leaves the viewport, so the rise replays on return.
 *  - reduced-motion users get the element immediately visible —
 *    content is never held hostage waiting for an animation.
 *
 * The ref and visibility state are exposed via useRise for components
 * that attach Rise to an existing element (buttons, cards) instead of
 * wrapping; the Rise wrapper covers the common case.
 */

const registrations = new Set();
let listening = false;
let syncTimer = 0;
let lastKnownScrollY = -1;

const BAND_BOTTOM_OFFSET = 40; // px above the bottom edge where the rise begins

function checkAll() {
  if (registrations.size === 0) return;
  const vh = window.innerHeight || document.documentElement.clientHeight;

  // Batch ALL reads before ANY write — one layout pass per scroll event.
  const updates = [];
  registrations.forEach((item) => {
    const el = item.el;
    if (!el || !el.isConnected) return;
    const rect = el.getBoundingClientRect();
    const inView = rect.top < vh - BAND_BOTTOM_OFFSET && rect.bottom > 0;
    if (inView !== item.visible) updates.push({ item, inView });
  });

  // Then write.
  updates.forEach(({ item, inView }) => {
    item.visible = inView;
    item.set(inView);
  });
}

function onScroll() {
  lastKnownScrollY = window.scrollY;
  checkAll();
}

function ensureListening() {
  if (listening || typeof window === 'undefined') return;
  listening = true;
  lastKnownScrollY = window.scrollY;
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  // Fallback pump: some occluded/backgrounded window states suppress
  // scroll EVENTS entirely (the page scrolls, JS never hears about it).
  // A cheap interval recomputes only when scrollY actually changed.
  syncTimer = setInterval(() => {
    const y = window.scrollY;
    if (y !== lastKnownScrollY) {
      lastKnownScrollY = y;
      checkAll();
    }
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
}

export function useRise() {
  const ref = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    // Reduced motion: never hide content waiting for an animation.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const raf = requestAnimationFrame(() => setMounted(true));
      return () => cancelAnimationFrame(raf);
    }

    const item = {
      el: node,
      set: setMounted,
      visible: false,
    };
    registrations.add(item);
    ensureListening();

    // Compute the initial state on the next tick (timers survive in
    // environments where rAF/observer callbacks are throttled) so
    // elements already inside the viewport rise immediately on load.
    const initialTimer = setTimeout(checkAll, 30);

    return () => {
      clearTimeout(initialTimer);
      registrations.delete(item);
      stopListeningIfIdle();
    };
  }, []);

  return [ref, mounted];
}

/**
 * Rise — zero-style wrapper giving ANY element (text, image, box/card)
 * its own independent Canva-style "Rise" entrance.
 *
 *   <Rise><div className="glass-card">…</div></Rise>   whole box rises
 *   <Rise as="span">inline text inside a heading</Rise>
 *   <Rise className="rise-stretch">grid/flex children</Rise>
 *
 * Renders a plain box (`as` tag, default div) that plays the rise
 * keyframe when it enters the viewport and replays it on re-entry.
 */
export default function Rise({
  as: Tag = 'div',
  className = '',
  children,
  ...rest
}) {
  const [ref, isVisible] = useRise();
  return (
    <Tag
      ref={ref}
      className={`rise ${isVisible ? 'rise-visible' : ''} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}
