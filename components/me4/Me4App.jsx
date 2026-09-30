'use client';

import React, { useState } from 'react';
import Header from './Header';
import HamburgerNav from './HamburgerNav';
import ParallaxBackground from './ParallaxBackground';
import CustomCursor from './CustomCursor';
import Hero from './Hero';
import About from './About';
import Skills from './Skills';
import Projects from './Projects';
import Journey from './Journey';
import Contact from './Contact';
import Footer from './Footer';
import BackToTop from './BackToTop';
import LightboxModal from './LightboxModal';

import styles from './Me4App.module.css';

/**
 * Me4App Component
 * SINGLE-PAGE portfolio: every section renders on ONE long scrolling page
 * and all navigation is in-page smooth scrolling (no routes, no page swaps,
 * no reloads). The menu is only a section navigator.
 */
export default function Me4App({ fixedOverlaysVisible = true, showHero = true }) {
  const [isNavOpen, setIsNavOpen] = useState(false);
  // Tracks the highlighted section for menu/header UI only — never used
  // to conditionally render content. All sections always stay mounted.
  const [activeSection, setActiveSection] = useState('overview');
  const [lightboxState, setLightboxState] = useState({ isOpen: false, item: null });

  const handleOpenLightbox = (item) => {
    setLightboxState({ isOpen: true, item });
  };

  const handleCloseLightbox = () => {
    setLightboxState({ isOpen: false, item: null });
  };

  /**
   * Section navigation happens inside HamburgerNav / Header / Hero via
   * the shared scrollToSection util — the app shell only holds the
   * active-section state used for menu highlighting.
   */

  return (
    <div className={styles.appWrapper}>
      {/* Custom Cyber Neon Cursor */}
      <CustomCursor />

      {/* Layered Parallax Background (only while the dark me 4 region is on screen) */}
      {fixedOverlaysVisible && <ParallaxBackground />}

      {/* Minimal Header with Hamburger Toggle Only (Hidden Nav) */}
      {fixedOverlaysVisible && <Header
        isNavOpen={isNavOpen}
        setIsNavOpen={setIsNavOpen}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />}

      {/* Hidden Navigation Overlay (Full HUD Drawer) */}
      <HamburgerNav
        isOpen={isNavOpen}
        onClose={() => setIsNavOpen(false)}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Main Content Area — ONE long scrolling page */}
      <main id="main-content" className={styles.mainContainer} role="main">
        {showHero && <Hero />}
        <About />
        <Skills />
        <Projects onOpenLightbox={handleOpenLightbox} />
        <Journey />
        <Contact />
      </main>

      {/* Single-Line Minimal Footer */}
      <Footer />

      {/* Back to Top Floating Button (only while the dark me 4 region is on screen) */}
      {fixedOverlaysVisible && <BackToTop />}

      {/* Image Lightbox Modal */}
      <LightboxModal
        isOpen={lightboxState.isOpen}
        onClose={handleCloseLightbox}
        item={lightboxState.item}
      />
    </div>
  );
}
