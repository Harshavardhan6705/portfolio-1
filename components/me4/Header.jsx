import React, { useState, useEffect } from 'react';
import { Menu, X, Cpu } from 'lucide-react';
import styles from './Header.module.css';
import scrollToSection from './scrollToSection';

/**
 * Header Component
 * Strict implementation of "Hamburger menu only (hidden nav)" requirement.
 * Shows minimalist brand logo, live cloud status badge, and the hamburger toggle button.
 */
export default function Header({ isNavOpen, setIsNavOpen, setActiveSection }) {
  const [scrolled, setScrolled] = useState(false);
  // FIRST-PAGE RULE: the header NAME (HARSHAVARDHAN J) is hidden while the
  // first-page hero fills the viewport and appears once the user scrolls
  // toward the second section. Only the name is affected — the CLOUD ×
  // DEVOPS badge, the location pill and the MENU button stay visible on
  // every page. `visibility: hidden` (not display:none) keeps the name's
  // space so no other header element shifts.
  const [nameHidden, setNameHidden] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
      setNameHidden(window.scrollY < window.innerHeight * 0.75);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const handleLogoClick = (e) => {
    e.preventDefault();
    setActiveSection('overview');
    scrollToSection('overview');
  };

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.headerContainer}>
        {/* Brand Logo */}
        <a href="#overview" className={styles.logo} onClick={handleLogoClick} aria-label="Harshavardhan J Home">
          <span className={`${styles.logoText} ${nameHidden ? styles.logoNameHidden : ''}`}>
            HARSHAVARDHAN<span className={styles.logoSuffix}> J</span>
          </span>
          <span className={styles.logoBadge}>
            <Cpu size={12} className={styles.logoIcon} />
            CLOUD × DEVOPS
          </span>
        </a>

        {/* Live Regional Status Indicator */}
        <div className={styles.statusPill} aria-label="Current Location and Status">
          <span className={styles.pulseDot} />
          <span className={styles.statusText}>COIMBATORE, IN · OPEN TO OPPORTUNITIES</span>
        </div>

        {/* Hamburger Menu Toggle Button (Primary & Only Navigation Mechanism) */}
        <button
          className={`${styles.hamburgerBtn} ${isNavOpen ? styles.btnActive : ''}`}
          onClick={() => setIsNavOpen(!isNavOpen)}
          aria-label={isNavOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isNavOpen}
        >
          <span className={styles.hamburgerText}>
            {isNavOpen ? 'CLOSE' : 'MENU'}
          </span>
          <div className={styles.iconWrapper}>
            {isNavOpen ? <X size={20} /> : <Menu size={20} />}
          </div>
        </button>
      </div>
    </header>
  );
}
