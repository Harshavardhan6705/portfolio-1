import React, { useEffect } from 'react';import {
  ArrowRight,  
  Terminal, 
  MapPin, 
  Clock, 
  Layers,
  Cpu,
  FolderGit2,
  Award,
  Send,
  Sparkles
} from 'lucide-react';
import styles from './HamburgerNav.module.css';
import scrollToSection from './scrollToSection';

// Precision Brand SVGs for bulletproof rendering
const GithubIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

/**
 * HamburgerNav Component
 * Full-screen cyber HUD overlay for navigation.
 * Fulfills requirement: "Navigation: Hamburger menu only (hidden nav)"
 * In-page section navigator: every item smooth-scrolls to a section on
 * the SAME page — no routes, no page swaps, no reloads, no new tabs.
 */
export default function HamburgerNav({ isOpen, onClose, activeSection, setActiveSection }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // In-page smooth scroll — shared util (same page, no routes, no reloads).
  // Every item targets a section id on THIS page. Selecting an item
  // closes the menu, then smooth-scrolls in place — nothing else.
  const navItems = [
    { id: 'overview', label: '01 // OVERVIEW & HERO', targetSection: 'about', icon: Sparkles },
    { id: 'skills', label: '02 // SKILLS & CERTIFICATIONS', targetSection: 'skills', icon: Cpu },
    { id: 'projects', label: '03 // PROJECTS & CASE STUDIES', targetSection: 'projects', icon: FolderGit2 },
    { id: 'timeline', label: '04 // EVOLUTION & TIMELINE', targetSection: 'timeline', icon: Award },
    { id: 'contact', label: '05 // CONTACT & CONNECT', targetSection: 'contact', icon: Send }
  ];

  const handleNavigate = (sectionId) => {
    setActiveSection(sectionId);
    onClose();
    scrollToSection(sectionId);
  };

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Main Navigation HUD">
      <div className={styles.overlayBackground} onClick={onClose} />
      
      <div className={styles.navContent}>
        {/* HUD Header Bar */}
        <div className={styles.hudHeader}>
          <div className={styles.hudTitle}>
            <Terminal size={16} className={styles.primaryIcon} />
            <span>NAVIGATION MATRIX // HARSHAVARDHAN.DEV</span>
          </div>
          <div className={styles.hudTime}>
            <Clock size={14} />
            <span>IST (UTC+5:30) · COIMBATORE</span>
          </div>
        </div>

        <div className={styles.gridColumns}>
          {/* Main Links List */}
          <nav className={styles.primaryNav}>
            <p className={styles.menuCaption}>SELECT VIEW / ROUTE</p>
            <ul className={styles.navList}>
              {navItems.map((item) => {
                const Icon = item.icon;
                // Item 01 never takes the solid active style — only the normal hover
                const isActive = item.id !== 'overview' && activeSection === item.id;
                return (
                  <li key={item.id} className={styles.navItem}>
                    <button
                      className={`${styles.navBtn} ${isActive ? styles.activeNavBtn : ''}`}
                      onClick={() => handleNavigate(item.targetSection)}
                    >
                      <span className={styles.navIcon}>
                        <Icon size={20} />
                      </span>
                      <span className={styles.navLabel}>{item.label}</span>
                      <ArrowRight size={18} className={styles.arrowIcon} />
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Sidebar / Quick Info & Socials */}
          <div className={styles.sidebarInfo}>
            <div className={styles.infoCard}>
              <h4 className={styles.infoTitle}>
                <MapPin size={16} className={styles.primaryIcon} />
                LOCATION & ORIGIN
              </h4>
              <p className={styles.infoValue}>Coimbatore, Tamil Nadu, India</p>
              <p className={styles.infoCoords}>Coordinates: 11.0168° N, 76.9558° E</p>
              <p className={styles.infoSub}>Focused on AWS Cloud & DevOps</p>
            </div>

            <div className={styles.infoCard}>
              <h4 className={styles.infoTitle}>
                <Layers size={16} className={styles.primaryIcon} />
                CORE DOMAINS
              </h4>
              <div className={styles.tagWrap}>
                <span className="badge badge-accent">AWS Cloud</span>
                <span className="badge">DevOps</span>
                <span className="badge">React & Next</span>
              </div>
            </div>

            <div className={styles.socialCard}>
              <h4 className={styles.infoTitle}>CONNECT & NETWORK</h4>
              <div className={styles.socialRow}>
                <a
                  href="https://github.com/Harshavardhan6705"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialBtn}
                  aria-label="GitHub Profile"
                >
                  <GithubIcon size={16} />
                  <span>GitHub</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/harshavardhan-cloud"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialBtn}
                  aria-label="LinkedIn Profile"
                >
                  <LinkedinIcon size={16} />
                  <span>LinkedIn</span>
                </a>

              </div>
            </div>
          </div>
        </div>

        {/* Footer Bar inside overlay */}
        <div className={styles.hudFooter}>
          <span className={styles.footerText}>PRESS [ESC] OR CLICK OUTSIDE TO CLOSE</span>
          <span className={styles.footerStatus}>SYSTEM :: ALL SERVICES OPERATIONAL</span>
        </div>
      </div>
    </div>
  );
}
