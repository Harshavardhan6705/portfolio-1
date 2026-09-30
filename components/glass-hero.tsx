"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  GraduationCap,
  Cloud,
} from "lucide-react";
import styles from "./GlassHero.module.css";
import scrollToSection from "./me4/scrollToSection";
import Pop from "./me4/Pop";
import Rise from "./me4/Rise";

const DESKTOP_RADIUS = 235;
const MOBILE_RADIUS = 150;

export default function GlassHero({
  onExplore,
}: {
  onExplore?: () => void;
}) {
  const heroRef = useRef<HTMLElement | null>(null);

  // Typewriter state for active roles
  const roles = [
    "AWS CLOUD ENGINEER",
    "CLOUD SUPPORT ENGINEER",
    "JUNIOR DEVOPS ENGINEER",
  ];
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentRole = roles[roleIndex];
    const speed = isDeleting ? 40 : 80;

    const timer = setTimeout(() => {
      if (!isDeleting && displayText === currentRole) {
        setTimeout(() => setIsDeleting(true), 1800);
      } else if (isDeleting && displayText === "") {
        setIsDeleting(false);
        setRoleIndex((prev) => (prev + 1) % roles.length);
      } else {
        setDisplayText(
          isDeleting
            ? currentRole.substring(0, displayText.length - 1)
            : currentRole.substring(0, displayText.length + 1)
        );
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, roleIndex]);

  // ── Pointer position & animation state (all refs — no React re-renders) ─────
  const rawPosRef = useRef<{ x: number; y: number }>({ x: -999, y: -999 });
  const smoothPosRef = useRef<{ x: number; y: number }>({ x: -999, y: -999 });
  const currentRadiusRef = useRef<number>(0);
  const targetRadiusRef = useRef<number>(0);
  const isTrackingRef = useRef<boolean>(false);
  const frameIdRef = useRef<number | null>(null);

  // ── Single RAF animation loop ────────────────────────────────────────────────
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

      // Write CSS variables directly on the hero element — no React setState
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

  // ── Mouse tracking via document.pointermove ──────────────────────────────────
  // WHY document-level: every pointer move on the page fires on `document`,
  // regardless of which element is under the cursor. This makes the listener
  // immune to:
  //   • pointer-events:none on portrait, grid, text, or content container
  //   • the fixed Header (z-index 9990) sitting above the hero
  //   • the fixed ParallaxBackground layer
  //   • the hv-page / appWrapper stacking contexts from Me4App
  //   • any Parallax wrapper div intercepting events
  // We check hero bounds with getBoundingClientRect() on every move — fast,
  // no layout thrash (read-only, no writes).
  useEffect(() => {
    const heroEl = heroRef.current;
    if (!heroEl) return;

    // Local state: whether cursor is currently inside hero bounds.
    // Using a closure variable (not a ref) so it's scoped to this effect.
    let mouseInside = false;

    // ── MOUSE ──────────────────────────────────────────────────────────────────
    const onDocumentPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;

      const rect = heroEl.getBoundingClientRect();
      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (inside) {
        const pos = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        rawPosRef.current = pos;

        if (!mouseInside) {
          // First move inside: snap smoothed position so reveal appears
          // at cursor immediately, not lerping from (-999, -999)
          mouseInside = true;
          smoothPosRef.current = { ...pos };
          targetRadiusRef.current = DESKTOP_RADIUS;
        } else if (targetRadiusRef.current === 0) {
          // Safety: if radius was closed (e.g. pointer leave edge case),
          // snap and reopen on re-entry
          smoothPosRef.current = { ...pos };
          targetRadiusRef.current = DESKTOP_RADIUS;
        }
        // Normal case: rawPosRef already updated above, RAF loop lerps it
      } else if (mouseInside) {
        // Cursor left the hero — smoothly contract the reveal
        mouseInside = false;
        targetRadiusRef.current = 0;
      }
    };

    // ── TOUCH / STYLUS ─────────────────────────────────────────────────────────
    // Touch uses hero-element listeners with pointer capture so move events
    // continue even if finger drifts outside the element bounds.
    const onHeroPointerDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse") return;
      isTrackingRef.current = true;
      try { heroEl.setPointerCapture(e.pointerId); } catch { /* noop */ }
      const rect = heroEl.getBoundingClientRect();
      const pos = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      rawPosRef.current = pos;
      smoothPosRef.current = { ...pos };
      targetRadiusRef.current = MOBILE_RADIUS;
    };

    const onHeroTouchMove = (e: PointerEvent) => {
      if (e.pointerType === "mouse" || !isTrackingRef.current) return;
      const rect = heroEl.getBoundingClientRect();
      rawPosRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const onHeroPointerUpOrCancel = (e: PointerEvent) => {
      if (e.pointerType === "mouse") return;
      isTrackingRef.current = false;
      targetRadiusRef.current = 0;
      try { heroEl.releasePointerCapture(e.pointerId); } catch { /* noop */ }
    };

    // Attach: mouse on document, touch on heroEl
    document.addEventListener("pointermove", onDocumentPointerMove);
    heroEl.addEventListener("pointerdown", onHeroPointerDown);
    heroEl.addEventListener("pointermove", onHeroTouchMove);
    heroEl.addEventListener("pointerup", onHeroPointerUpOrCancel);
    heroEl.addEventListener("pointercancel", onHeroPointerUpOrCancel);

    return () => {
      document.removeEventListener("pointermove", onDocumentPointerMove);
      heroEl.removeEventListener("pointerdown", onHeroPointerDown);
      heroEl.removeEventListener("pointermove", onHeroTouchMove);
      heroEl.removeEventListener("pointerup", onHeroPointerUpOrCancel);
      heroEl.removeEventListener("pointercancel", onHeroPointerUpOrCancel);
    };
  }, []);

  const statIcons = [GraduationCap, Cloud, Sparkles];
  const statValues = [
    "B.Sc. Computer Technology",
    "AWS Cloud & DevOps",
    "Fresher",
  ];
  const statLabels = ["EDUCATION", "CAREER FOCUS", "ENTRY LEVEL"];

  return (
    <section
      id="overview"
      ref={heroRef}
      className={styles.heroSection}
      aria-label="Hero Introduction"
    >
      {/* Target Anchor for smooth scroll */}
      <span id="hero" className="sr-only" aria-hidden="true" />

      {/* Layer 1 & 2: Base & Reveal Portrait Layers */}
      <div className={styles.portraitContainer} aria-hidden="true">
        <div className={styles.portraitImgBase} />
        <div className={styles.portraitImgReveal} />
      </div>

      {/* Layer 3: Technical Background Grid & Ambient Glows */}
      <div className={styles.gridLayer} aria-hidden="true" />
      <div className={`${styles.glowOrb} ${styles.glowOrb1}`} aria-hidden="true" />
      <div className={`${styles.glowOrb} ${styles.glowOrb2}`} aria-hidden="true" />

      {/* Layer 4: Editorial Hero Text Content */}
      {/* pointer-events:none on the container so the hero section below
          always receives pointer events; interactive children (links,
          buttons) override this back to auto via CSS. */}
      <div className={`container ${styles.heroContentContainer}`}>
        <div className={styles.heroWrapper}>
          {/* Heading Section */}
          <div className={styles.titleContainer}>
            <Rise as="p" className={styles.greetingText}>Hello world, I am</Rise>
            <Pop strength={14}>
              <Rise as="h1" className={styles.mainTitle}>
                HARSHAVARDHAN<br />
                <span className={styles.titleInitial}>J</span>
              </Rise>
            </Pop>
            <Pop strength={9}>
              <Rise as="p" className={styles.heroTagline}>AWS CLOUD &times; DEVOPS</Rise>
            </Pop>
          </div>

          {/* Dynamic Role Typewriter Bar */}
          <Pop strength={7}>
            <Rise as="div" className={styles.roleBar}>
              <span className={styles.rolePrefix}>$ ACTIVE_ROLE:</span>
              <span className={styles.typingRole}>{displayText}</span>
              <span className={styles.cursorBlink}>|</span>
            </Rise>
          </Pop>

          {/* Hero Subtitle / Summary */}
          <Pop strength={8}>
            <Rise as="p" className={styles.heroDescription}>
              Building practical skills in AWS Cloud and DevOps, with a focus on
              cloud infrastructure, automation, containers, CI/CD, and reliable
              application deployment.
            </Rise>
          </Pop>

          {/* Information Metric Cards */}
          <div className={styles.metricsGrid}>
            {statValues.map((val, idx) => {
              const StatIcon = statIcons[idx % statIcons.length];
              return (
                <Pop key={idx} strength={5} className="pop-stretch">
                  <Rise as="div" className={styles.metricCard}>
                    <div className={styles.metricHeader}>
                      <StatIcon size={16} className={styles.primaryIcon} />
                      <span className={styles.metricValue}>{val}</span>
                    </div>
                    <span className={styles.metricLabel}>{statLabels[idx]}</span>
                  </Rise>
                </Pop>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
