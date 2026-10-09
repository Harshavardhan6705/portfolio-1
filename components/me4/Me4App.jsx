'use client';

import React, { useState, useEffect } from 'react';
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

  // Scroll entrance (modelled on the reference site): each section header
  // and each card starts blurred and transparent, then settles into focus
  // when the user reaches it, while heading letters flip up one by one.
  // Each block resets when it leaves the viewport, so it replays every
  // time the user comes back. The pending classes are added from JS, so
  // nothing stays hidden without JavaScript.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Split every section heading into per-letter spans. Words are kept in
    // nowrap wrappers so line-breaking stays exactly as before.
    document.querySelectorAll('.hv-page section.section .section-title').forEach((title) => {
      if (title.dataset.split) return;
      title.dataset.split = 'true';
      title.setAttribute('aria-label', title.textContent.trim());
      let index = 0;
      const walker = document.createTreeWalker(title, NodeFilter.SHOW_TEXT);
      const textNodes = [];
      while (walker.nextNode()) textNodes.push(walker.currentNode);
      textNodes.forEach((node) => {
        const frag = document.createDocumentFragment();
        node.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(part));
            return;
          }
          const word = document.createElement('span');
          word.className = 'split-word';
          word.setAttribute('aria-hidden', 'true');
          [...part].forEach((ch) => {
            const char = document.createElement('span');
            char.className = 'split-char';
            char.style.setProperty('--ci', index++);
            char.textContent = ch;
            word.appendChild(char);
          });
          frag.appendChild(word);
        });
        node.replaceWith(frag);
      });
    });

    // Reveal each block on its OWN visibility — every section header and
    // every card comes into focus only when the user actually reaches it.
    const blocks = [
      ...document.querySelectorAll(
        '.hv-page section.section .section-header, .hv-page section.section .glass-card'
      ),
    ];
    // Text inside each card that isn't already a Rise element (skill tags,
    // checklist lines, contact details…) also reveals on its own visibility.
    document.querySelectorAll('.hv-page section.section .glass-card').forEach((card) => {
      card.querySelectorAll('*').forEach((el) => {
        if (el.closest('svg') || el.closest('form')) return;
        const hasText = [...el.childNodes].some(
          (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim()
        );
        if (!hasText) return;
        const rise = el.closest('.rise');
        if (rise && card.contains(rise) && rise !== card) return; // Rise handles it
        blocks.push(el);
      });
    });
    blocks.forEach((b) => b.classList.add('blur-reveal'));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle('blur-revealed', entry.isIntersecting);
        });
      },
      { rootMargin: '-18% 0px -12% 0px', threshold: 0 } // top band: blur out under the header
    );
    blocks.forEach((b) => observer.observe(b));

    // Headings animate on their OWN visibility, so a heading lower down a
    // tall section (e.g. "Education & Certifications" inside Skills) still
    // plays when the user reaches it — and replays on every return.
    const titles = document.querySelectorAll('.hv-page section.section .section-title');
    const titleObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle('title-in', entry.isIntersecting);
        });
      },
      { rootMargin: '-18% 0px -10% 0px', threshold: 0 }
    );
    titles.forEach((t) => titleObserver.observe(t));

    return () => {
      observer.disconnect();
      titleObserver.disconnect();
    };
  }, []);

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
