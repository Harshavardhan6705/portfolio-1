import React, { useEffect, useState } from 'react';
import styles from './ParallaxBackground.module.css';

/**
 * ParallaxBackground Component
 * Renders layered background elements (cyber grid, depth coordinates, ambient neon glow spots)
 * responding smoothly to scroll position without any mouse tracking.
 */
export default function ParallaxBackground() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={styles.parallaxContainer} aria-hidden="true">
      {/* Base Grid Pattern */}
      <div 
        className={styles.gridLayer}
        style={{
          transform: `translate3d(0, ${scrollY * 0.05}px, 0)`
        }}
      />

      {/* Layer 1: Ambient Neon Glow Spot top right */}
      <div 
        className={`${styles.glowOrb} ${styles.glowOrb1}`}
        style={{
          transform: `translate3d(0, ${scrollY * -0.15}px, 0)`
        }}
      />

      {/* Layer 2: Ambient Neon Glow Spot mid left */}
      <div 
        className={`${styles.glowOrb} ${styles.glowOrb2}`}
        style={{
          transform: `translate3d(0, ${scrollY * 0.08}px, 0)`
        }}
      />

      {/* Layer 3: Tech Scanlines */}
      <div className={styles.scanlineOverlay} />

      {/* Floating Depth Markers (fresher-safe branding) */}
      <div 
        className={styles.coordinateWatermark}
        style={{
          transform: `translate3d(0, ${scrollY * 0.12}px, 0)`
        }}
      >
        <span>AWS CLOUD × DEVOPS</span>
        <span>COIMBATORE :: TAMIL NADU :: IN</span>
      </div>
    </div>
  );
}
