import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import styles from './BackToTop.module.css';

/**
 * BackToTop Component
 * Smooth floating button with scroll threshold visibility.
 */
export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      if (totalHeight > 0) {
        setScrollProgress((currentScroll / totalHeight) * 100);
      }
      setVisible(currentScroll > 350);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!visible) return null;

  return (
    <button
      className={styles.backToTopBtn}
      onClick={scrollToTop}
      aria-label="Back to top of page"
      title="Back to Top"
    >
      {/* SVG Circular Progress Ring */}
      <svg className={styles.progressRing} width="48" height="48" viewBox="0 0 48 48">
        <circle
          className={styles.ringTrack}
          cx="24"
          cy="24"
          r="20"
        />
        <circle
          className={styles.ringFill}
          cx="24"
          cy="24"
          r="20"
          style={{
            strokeDasharray: 125.6,
            strokeDashoffset: 125.6 - (125.6 * scrollProgress) / 100
          }}
        />
      </svg>
      <ArrowUp size={20} className={styles.arrowIcon} />
    </button>
  );
}
