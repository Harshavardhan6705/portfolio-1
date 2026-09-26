"use client";

import React, { useEffect, useRef } from "react";

const DESKTOP_RADIUS = 235;
const MOBILE_RADIUS = 150;

export default function GlassHero() {
  const heroRef = useRef<HTMLElement | null>(null);

  // Pointer position & animation state stored purely in refs (no React re-renders)
  const rawPosRef = useRef<{ x: number; y: number }>({ x: -999, y: -999 });
  const smoothPosRef = useRef<{ x: number; y: number }>({ x: -999, y: -999 });
  const currentRadiusRef = useRef<number>(0);
  const targetRadiusRef = useRef<number>(0);
  const isTrackingRef = useRef<boolean>(false);
  const frameIdRef = useRef<number | null>(null);

  useEffect(() => {
    const heroEl = heroRef.current;
    if (!heroEl) return;

    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    const animate = () => {
      const isReduced = reducedMotionQuery.matches;
      const posFactor = isReduced ? 1 : 0.14;
      const radiusFactor = isReduced ? 1 : 0.12;

      // Interpolate smoothed position towards raw target position
      if (rawPosRef.current.x !== -999 && rawPosRef.current.y !== -999) {
        if (smoothPosRef.current.x === -999 || smoothPosRef.current.y === -999) {
          smoothPosRef.current.x = rawPosRef.current.x;
          smoothPosRef.current.y = rawPosRef.current.y;
        } else {
          smoothPosRef.current.x +=
            (rawPosRef.current.x - smoothPosRef.current.x) * posFactor;
          smoothPosRef.current.y +=
            (rawPosRef.current.y - smoothPosRef.current.y) * posFactor;
        }
      }

      // Interpolate radius towards target radius
      currentRadiusRef.current +=
        (targetRadiusRef.current - currentRadiusRef.current) * radiusFactor;

      // Update CSS variables directly on container element
      heroEl.style.setProperty(
        "--reveal-x",
        `${smoothPosRef.current.x.toFixed(2)}px`
      );
      heroEl.style.setProperty(
        "--reveal-y",
        `${smoothPosRef.current.y.toFixed(2)}px`
      );
      heroEl.style.setProperty(
        "--reveal-radius",
        `${currentRadiusRef.current.toFixed(2)}px`
      );

      frameIdRef.current = requestAnimationFrame(animate);
    };

    frameIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameIdRef.current !== null) {
        cancelAnimationFrame(frameIdRef.current);
      }
    };
  }, []);

  const updateRawPos = (e: React.PointerEvent<HTMLElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    rawPosRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handlePointerEnter = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType === "mouse") {
      updateRawPos(e);
      if (smoothPosRef.current.x === -999) {
        smoothPosRef.current = { ...rawPosRef.current };
      }
      targetRadiusRef.current = DESKTOP_RADIUS;
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType === "mouse") {
      updateRawPos(e);
      if (targetRadiusRef.current === 0) {
        targetRadiusRef.current = DESKTOP_RADIUS;
      }
    } else {
      // Touch or pen: update position only while tracking
      if (isTrackingRef.current) {
        updateRawPos(e);
      }
    }
  };

  const handlePointerLeave = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType === "mouse") {
      targetRadiusRef.current = 0;
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") {
      isTrackingRef.current = true;
      try {
        if ("setPointerCapture" in e.target) {
          (e.target as HTMLElement).setPointerCapture(e.pointerId);
        }
      } catch {
        // Fallback if capture fails
      }
      updateRawPos(e);
      smoothPosRef.current = { ...rawPosRef.current };
      targetRadiusRef.current = MOBILE_RADIUS;
    }
  };

  const handlePointerUpOrCancel = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse" || isTrackingRef.current) {
      isTrackingRef.current = false;
      targetRadiusRef.current = 0;
      try {
        if ("releasePointerCapture" in e.target) {
          (e.target as HTMLElement).releasePointerCapture(e.pointerId);
        }
      } catch {
        // Fallback
      }
    }
  };

  return (
    <section
      ref={heroRef}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUpOrCancel}
      onPointerCancel={handlePointerUpOrCancel}
      className="relative isolate overflow-hidden h-[100dvh] min-h-[42rem] min-w-[320px] touch-none select-none bg-[#edf5ff] text-[#0a0f18]"
      aria-label="Hero showcase"
    >
      {/* 1. Base Portrait Layer */}
      <div className="hero-bg-base z-0" aria-hidden="true" />

      {/* 2. Reveal Portrait Layer (Liquid Glass Anatomical Version) */}
      <div className="hero-bg-reveal z-10 pointer-events-none" aria-hidden="true" />

      {/* 3. Technical Grid & Background Circle Layer */}
      <div
        className="absolute inset-0 z-20 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        {/* Technical Grid Lines */}
        <div className="absolute inset-0 grid grid-cols-4 grid-rows-6 md:grid-cols-12 md:grid-rows-4 opacity-30 md:opacity-50">
          {Array.from({ length: 48 }).map((_, i) => (
            <div
              key={i}
              className="border-r border-b border-[#a5c0de]/35 last:border-r-0"
            />
          ))}
        </div>

        {/* Oversized Fine-Line Technical Circle */}
        <div className="absolute rounded-full border border-[#96b8db]/45 w-[150vw] md:w-[min(78vw,72rem)] aspect-square left-[-76%] md:left-[8%] top-[-8%] md:top-[-36%] pointer-events-none" />
      </div>

      {/* 4. Navigation */}
      <header className="absolute top-0 left-0 right-0 z-50 pt-[max(2.5rem,env(safe-area-inset-top))] px-[max(1.25rem,env(safe-area-inset-left))] md:px-[max(5.6vw,2rem)] pr-[max(1.25rem,env(safe-area-inset-right))] md:pr-[max(5.6vw,2rem)] animate-nav-down">
        <nav
          className="flex items-center justify-between w-full"
          aria-label="Main Navigation"
        >
          {/* Brand Monogram & Name */}
          <a
            href="#"
            className="flex items-center gap-3 group focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0a0f18] rounded-md p-1 min-h-[44px]"
          >
            <span className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm border border-white/80 flex items-center justify-center shadow-xs group-hover:bg-white transition-colors">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 stroke-[#0a0f18]"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {/* Custom Monogram for 'A' */}
                <path d="M12 3L3 21H7.5L12 11.5L16.5 21H21L12 3Z" />
                <path d="M8.5 15H15.5" />
              </svg>
            </span>
            <span className="font-mono text-xs md:text-sm uppercase tracking-widest font-semibold text-[#0a0f18]">
              ALEX RIVERA
            </span>
          </a>

          {/* Desktop Nav Links */}
          <ul className="hidden md:flex items-center gap-8 font-mono text-xs uppercase tracking-widest text-[#0a0f18]/80">
            <li>
              <a
                href="#about"
                className="hover:text-[#0a0f18] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a0f18] rounded px-1 py-0.5"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#work"
                className="hover:text-[#0a0f18] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a0f18] rounded px-1 py-0.5"
              >
                Work
              </a>
            </li>
            <li>
              <a
                href="#process"
                className="hover:text-[#0a0f18] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a0f18] rounded px-1 py-0.5"
              >
                Process
              </a>
            </li>
            <li>
              <a
                href="#experiments"
                className="hover:text-[#0a0f18] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a0f18] rounded px-1 py-0.5"
              >
                Experiments
              </a>
            </li>
          </ul>

          {/* CTA Link / Button */}
          <a
            href="mailto:hello@alexrivera.design"
            target="_blank"
            rel="noreferrer"
            className="bg-white text-[#0a0f18] font-mono text-xs uppercase tracking-wider px-5 py-2.5 rounded-full border border-white/80 shadow-xs hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a0f18] min-h-[44px] inline-flex items-center justify-center font-medium"
          >
            Let's talk
          </a>
        </nav>
      </header>

      {/* 5. Editorial Content Overlay Layer */}
      <div className="absolute inset-0 z-40 pointer-events-none">
        {/* Main Headline */}
        <div className="absolute top-[15%] md:top-[34%] left-[max(1.25rem,env(safe-area-inset-left))] md:left-[max(5.6vw,2rem)] max-w-[62%] md:max-w-none min-w-[280px]">
          <h1 className="font-sans font-light tracking-[-0.085em] text-[#0a0f18] text-[clamp(2.7rem,12.5vw,3.8rem)] leading-[0.87] md:text-[clamp(5.4rem,6.2vw,6.8rem)] md:leading-[0.93]">
            <span className="block animate-line-1">BUILDING</span>
            <span className="block animate-line-2">BEYOND</span>
            <span className="block animate-line-3">POSSIBLE.</span>
          </h1>
        </div>

        {/* Tagline on the Right */}
        <div className="absolute top-[55%] md:top-[50%] md:-translate-y-1/2 right-[max(1.25rem,env(safe-area-inset-right))] md:right-[max(5.6vw,2rem)] text-right animate-tagline-up">
          <p className="font-mono text-[10px] md:text-xs uppercase tracking-widest text-[#0a0f18]/70 leading-relaxed">
            BUILDING THE
            <br />
            NEXT VERSION
            <br />
            IN PUBLIC
          </p>
        </div>

        {/* Bottom Left Intro & CTA Button */}
        <div className="absolute bottom-[max(2rem,env(safe-area-inset-bottom))] left-[max(1.25rem,env(safe-area-inset-left))] md:left-[max(5.6vw,2rem)] max-w-[85vw] md:max-w-md animate-intro-up">
          <p className="font-sans text-sm md:text-base text-[#0a0f18]/85 leading-relaxed mb-4">
            Architecting fluid digital experiences at the intersection of
            design, code, and intelligence.
          </p>

          <a
            href="mailto:hello@alexrivera.design"
            target="_blank"
            rel="noreferrer"
            className="pointer-events-auto bg-white text-[#0a0f18] font-mono text-xs uppercase tracking-wider px-6 py-3 rounded-full border border-white/80 shadow-xs hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a0f18] min-h-[44px] inline-flex items-center justify-center font-medium"
          >
            Explore my work
          </a>
        </div>
      </div>
    </section>
  );
}
