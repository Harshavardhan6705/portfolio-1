'use client';

import { useCallback, useEffect, useRef } from 'react';
import { registerPop } from './popMotionRegistry';

/**
 * usePopMotion — per-element scroll-DIRECTION pop motion.
 *
 * Scrolling down → the element drifts ↑ up toward its exit edge;
 * scrolling up → it drifts ↓ down toward its exit edge; the moment
 * scrolling stops it springs back to its natural position.
 *
 * Uses a CALLBACK ref (not an effect): React invokes it the moment the
 * DOM node attaches and again with null on detach, so registration can
 * never be missed by hydration, remount or node-replacement quirks.
 * Every caller gets its own wrapper, its own strength and its own
 * registration — elements never share state, refs or movement.
 *
 * The coordinator writes translate3d directly to the node — zero React
 * re-renders while scrolling. Strength scale:
 *   small labels 6-8 · headings 12-16 · descriptions 8-10
 *   cards 6 · tags/buttons 8 · images 26-30
 *
 * Returns the callback ref to attach to the wrapper element.
 */
export default function usePopMotion({ strength = 10 } = {}) {
  const strengthRef = useRef(strength);

  // Sync the strength outside of render (effect) — the callback ref reads it.
  useEffect(() => {
    strengthRef.current = strength;
  }, [strength]);

  const attach = useCallback(
    (node) => {
      // Detach: node removed or replaced.
      if (!node) return;
      // Attach. registerPop returns its own unregister function,
      // which React invokes automatically when the node is removed
      // (callback refs may return a cleanup — supported since React 19)
      // and is also idempotent-safe for manual cleanup paths.
      return registerPop({ el: node, strength: strengthRef.current });
    },
    [] // strengthRef is stable; strength changes flow through the effect
  );

  return attach;
}
