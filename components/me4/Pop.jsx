'use client';

import React from 'react';
import usePopMotion from './usePopMotion';

/**
 * Pop — zero-style wrapper giving ANY element its own independent
 * scroll-DIRECTION pop motion. Renders a plain box (`as` tag, default
 * div) that drives a translate3d on itself from the shared scroll
 * coordinator.
 *
 * Behavior (direction-driven):
 *   scrolling DOWN → drifts ↑ up · scrolling UP → drifts ↓ down
 *   scrolling stops → springs back to natural position (the "pop")
 *
 * strength = max px drift at the element's exit edge (scaled down on
 * mobile by the coordinator). Suggested scale:
 *   small labels 6-8 · headings 12-16 · descriptions 8-10
 *   cards 6 · tags/buttons 8 · images 26-30
 *
 * Because it is a wrapper, it never conflicts with reveal or hover
 * transforms living on the elements INSIDE it.
 *
 * IMPORTANT: use as="span" when nesting inside <p>/<h1>-<h6>/<span>/<a>
 * — a <div> there is invalid HTML and breaks hydration.
 */
export default function Pop({ as: Tag = 'div', strength = 10, className = '', children, ...rest }) {
  const attach = usePopMotion({ strength });
  return (
    <Tag ref={attach} className={`pop-motion ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
