import React from 'react';
import { MapPin, Cloud, Terminal, CheckCircle2, FileText, Globe } from 'lucide-react';
import { personalInfo } from './data/portfolioData';
import styles from './About.module.css';
import Rise from './Rise';

/**
 * About Component
 * Fresher profile narrative for Harshavardhan J from Coimbatore, India.
 * Card-based grid structure with learning philosophy and profile highlights.
 */
export default function About() {
  return (
    <section id="about" className="section" aria-label="About Harshavardhan J">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <Rise as="div" className="section-label">
            <Terminal size={14} />
            <span>01 // PROFILE & BACKGROUND</span>
          </Rise>
          <Rise as="h2" className="section-title">
            BUILDING MY <span className="accent">FOUNDATION</span> IN CLOUD & DEVOPS
          </Rise>
        </div>

        {/* Content Layout Grid */}
        <div className={styles.aboutGrid}>
          
          {/* Main Story Card — the whole box rises as one element */}
          <Rise className="rise-stretch">
          <div className={`${styles.mainBioCard} glass-card card-dark`}>
            <div className={styles.cardHeader}>
              <Globe size={20} className={styles.iconAccent} />
              <Rise as="h3" className={styles.cardTitle}>LEARNING PHILOSOPHY</Rise>
            </div>
            
            <div className={styles.paragraphs}>
              {personalInfo.aboutParagraphs.map((para, idx) => (
                <Rise key={idx} as="p" className={styles.bioPara}>
                  {para}
                </Rise>
              ))}
            </div>

            <div className={styles.bioHighlights}>
              {personalInfo.highlights.map((item, idx) => (
                <Rise key={idx} className={styles.checkItem}>
                  <CheckCircle2 size={16} className={styles.iconAccent} />
                  <span>{item}</span>
  </Rise>
              ))}
            </div>
          </div>
          </Rise>

          {/* Location & Origin Card — the whole box rises as one element */}
          <Rise className="rise-stretch">
          <div className={`${styles.locationCard} glass-card card-dark`}>
            <div className={styles.locationHeader}>
              <MapPin size={24} className={styles.iconAccent} />
              <div>
                <Rise as="h4" className={styles.locationTitle}>COIMBATORE, INDIA</Rise>
                <Rise as="p" className={styles.locationSub}>Tamil Nadu</Rise>
              </div>
            </div>
            
            <Rise as="p" className={styles.locationDesc}>
              Based in Coimbatore — the thriving technology and industrial hub of South India.
            </Rise>

            <div className={styles.statusBox}>
              <span className={styles.statusDot} />
              <span className={styles.statusText}>{personalInfo.status}</span>
            </div>

            <Rise
              as="a"
              href="/Harshavardhan_J_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              style={{ width: '100%', marginTop: '1rem' }}
            >
              <FileText size={16} />
              <span>REQUEST DIRECT CV / RESUME</span>
            </Rise>
          </div>
          </Rise>

        </div>

      </div>
    </section>
    );
}
