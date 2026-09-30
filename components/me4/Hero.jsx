import React, { useState, useEffect } from 'react';
import { Terminal, ArrowUpRight, FolderGit2, Sparkles, MapPin, GraduationCap, Cloud } from 'lucide-react';
import { personalInfo } from './data/portfolioData';
import styles from './Hero.module.css';
import scrollToSection from './scrollToSection';
import Pop from './Pop';

/**
 * Hero Component
 * Minimal text-only hero with bold typography, no background image.
 * Techy aesthetics, typewriter role rotator, location tag, and fresher stat cards.
 */
export default function Hero() {
  const roles = [
    "AWS CLOUD ENGINEER",
    "CLOUD SUPPORT ENGINEER",
    "JUNIOR DEVOPS ENGINEER"
  ];

  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentRole = roles[roleIndex];
    const speed = isDeleting ? 40 : 80;

    const timer = setTimeout(() => {
      if (!isDeleting && displayText === currentRole) {
        setTimeout(() => setIsDeleting(true), 1800);
      } else if (isDeleting && displayText === '') {
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

  const statIcons = [GraduationCap, Cloud, Sparkles];
  const statLabels = ["EDUCATION", "CAREER FOCUS", "ENTRY LEVEL"];

  return (
    <section id="overview" className={styles.heroSection} aria-label="Hero Introduction">
      <div className="container">
        <div className={styles.heroWrapper}>
          
          {/* Top Tech Terminal Metadata Bar */}
          <div className={styles.terminalMeta}>
            <div className={styles.metaBadge}>
              <Terminal size={14} className={styles.primaryIcon} />
              <span>SYS.INIT :: HARSHAVARDHAN_J.DEV</span>
            </div>
            <div className={styles.locationTag}>
              <MapPin size={13} className={styles.primaryIcon} />
              <span>COIMBATORE, INDIA</span>
            </div>
          </div>

          {/* Minimal Text-Only Hero Heading — name, tagline and role each
              carry their own parallax depth for layered motion. */}
          <div className={styles.titleContainer}>
            <p className={styles.greetingText}>HELLO WORLD, I AM</p>
            <Pop strength={14}>
              <h1 className={styles.mainTitle}>
                HARSHAVARDHAN <span className={styles.titleInitial}>J</span>
              </h1>
            </Pop>
            <Pop strength={9}>
              <p className={styles.heroTagline}>{personalInfo.tagline}</p>
            </Pop>
          </div>

          {/* Dynamic Role Typewriter Bar */}
          <Pop strength={7}>
            <div className={styles.roleBar}>
              <span className={styles.rolePrefix}>$ ACTIVE_ROLE:</span>
              <span className={styles.typingRole}>{displayText}</span>
              <span className={styles.cursorBlink}>|</span>
            </div>
          </Pop>

          {/* Hero Subtitle / Summary */}
          <Pop strength={8}>
            <p className={styles.heroDescription}>
              {personalInfo.bioHeadline}
            </p>
          </Pop>

          {/* Primary Action Buttons — own wrapper so the buttons' hover
              translateY is untouched by parallax. */}
          <div className={styles.ctaGroup}>
            <Pop strength={6} className="pop-flex">
              <a 
                href="#projects" 
                className="btn-primary" 
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('projects');
                }}
              >
                <FolderGit2 size={18} />
                <span>VIEW MY PROJECTS</span>
                <ArrowUpRight size={18} />
              </a>
            </Pop>
            
            <Pop strength={6} className="pop-flex">
              <a 
                href="#contact" 
                className="btn-secondary"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('contact');
                }}
              >
                <Sparkles size={18} />
                <span>CONNECT WITH ME</span>
              </a>
            </Pop>
          </div>

          {/* Simple Truthful Information Cards — each stat card drifts
              independently (very subtle, cards move least). */}
          <div className={styles.metricsGrid}>
            {personalInfo.heroStats.map((stat, idx) => {
              const StatIcon = statIcons[idx % statIcons.length];
              return (
                <Pop key={idx} strength={5} className="pop-stretch">
                  <div className={styles.metricCard}>
                    <div className={styles.metricHeader}>
                      <StatIcon size={16} className={styles.primaryIcon} />
                      <span className={styles.metricValue}>{stat}</span>
                    </div>
                    <span className={styles.metricLabel}>{statLabels[idx]}</span>
                  </div>
                </Pop>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
