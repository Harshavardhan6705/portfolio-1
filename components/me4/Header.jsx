import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import styles from './Header.module.css';
import scrollToSection from './scrollToSection';

/**
 * Header Component
 * Strict implementation of "Hamburger menu only (hidden nav)" requirement.
 * Shows minimalist brand logo, live cloud status badge, and the hamburger toggle button.
 */
export default function Header({ isNavOpen, setIsNavOpen, setActiveSection }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoClick = (e) => {
    e.preventDefault();
    setActiveSection('overview');
    scrollToSection('overview');
  };

  // Inline section links (desktop/laptop)
  const sectionLinks = [
    { id: 'about', label: 'ABOUT' },
    { id: 'skills', label: 'SKILLS' },
    { id: 'projects', label: 'PROJECTS' },
    { id: 'timeline', label: 'TIMELINE' },
    { id: 'contact', label: 'CONTACT' },
  ];

  // Position the bar's hover spotlight under the cursor
  const handleBarMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--glow-x', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--glow-y', `${e.clientY - rect.top}px`);
  };

  const handleSectionClick = (e, id) => {
    e.preventDefault();
    setActiveSection(id);
    scrollToSection(id);
  };

  return (
    <header className={`theme-dark ${styles.header} ${scrolled ? styles.scrolled : ''} ${styles.withNav}`}>
      <div className={styles.headerContainer} onMouseMove={handleBarMouseMove}>
        {/* Brand Logo */}
        <a href="#overview" className={styles.logo} onClick={handleLogoClick} aria-label="Harshavardhan J Home">
          <span className={styles.logoText}>
            HARSHA <span className={styles.logoAccent}>J</span>
          </span>
        </a>

        {/* Section Navigation — replaces status pill + MENU after the hero */}
        <nav className={styles.sectionNav} aria-label="Section navigation">
          {sectionLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className={styles.sectionLink}
              onClick={(e) => handleSectionClick(e, link.id)}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Call-to-action on the right of the capsule bar (desktop/laptop) */}
        <a href="#contact" className={styles.ctaBtn} onClick={(e) => handleSectionClick(e, 'contact')}>
          LET&apos;S TALK
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
