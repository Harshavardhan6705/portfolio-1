import React from 'react';
import {
  Terminal, Cloud, Wrench, Workflow, Award, ExternalLink
} from 'lucide-react';
import { skillsCategories, certifications } from './data/portfolioData';
import styles from './Skills.module.css';
import Pop from './Pop';
import Rise from './Rise';

/**
 * Skills Component
 * Cloud-focused skills layout: category cards with tech chips, plus certifications.
 * No percentage bars or mastery ratings — truthful, fresher-friendly presentation.
 */
const iconMap = {
  Cloud, Wrench, Workflow
};

export default function Skills() {
  return (
    <section id="skills" className="section" aria-label="Skills & Certifications">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <Pop strength={4}>
            <Rise as="div" className="section-label">
              <Terminal size={14} />
              <span>02 // SKILLS & CERTIFICATIONS</span>
            </Rise>
          </Pop>
          <Pop strength={11}>
            <Rise as="h2" className="section-title">
              CLOUD & <span className="accent">DEVOPS TOOLKIT</span>
            </Rise>
          </Pop>
        </div>

        {/* Category Cards Grid */}
        <div className={styles.skillsGridWrapper}>
          {skillsCategories.map((cat, idx) => {
            const CatIcon = iconMap[cat.icon] || Cloud;
            return (
              <Pop key={idx} strength={5} className="pop-stretch">
                <Rise className="rise-stretch">
                <div className={`${styles.categoryCard} glass-card card-dark`}>
                  <div className={styles.catHeader}>
                    <div className={styles.iconWrap}>
                      <CatIcon size={22} />
                    </div>
                    <Pop strength={9} className="pop-inner">
                      <Rise as="h3" className={styles.catTitle}>{cat.category}</Rise>
                    </Pop>
                  </div>
                  <Pop strength={7} className="pop-inner">
                    <Rise as="p" className={styles.catDesc}>{cat.description}</Rise>
                  </Pop>
                  <Pop strength={6} className="pop-inner">
                    <Rise as="div" className={styles.chipsWrap}>
                      {cat.skills.map((skill, sIdx) => (
                        <span key={sIdx} className="badge">{skill}</span>
                      ))}
                    </Rise>
                  </Pop>
                </div>
                </Rise>
              </Pop>
            );
          })}
        </div>

        {/* Certifications */}
        <div className={styles.certSection}>
          <div className="section-header">
            <Rise as="h2" className="section-title">
              EDUCATION & <span className="accent">CERTIFICATIONS</span>
            </Rise>
          </div>

          <div className={styles.certCards}>
            {certifications.map((cert, idx) => (
              <Pop key={idx} strength={5} className="pop-stretch">
                <Rise className="rise-stretch">
                <div className={`${styles.certCard} glass-card`}>
                  <div className={styles.certIconWrap}>
                    {cert.icon === 'Cloud' ? <Cloud size={22} /> : <Award size={22} />}
                  </div>
                  <div className={styles.certBody}>
                    <Pop strength={9} className="pop-inner">
                      <Rise as="h3" className={styles.certTitle}>{cert.title}</Rise>
                    </Pop>
                    <Pop strength={6} className="pop-inner">
                      <Rise as="p" className={styles.certIssuer}>{cert.issuer}</Rise>
                    </Pop>

                  {/* Verifiable credential link — rendered only when a real
                      URL exists. No fake verification, no invented IDs. */}
                  {cert.credentialUrl && (
                    <Pop strength={6} className="pop-inner">
                      <Rise
                        as="a"
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.credentialBtn}
                        aria-label={`View ${cert.title} credential (opens in a new tab)`}
                      >
                        <span>VIEW CREDENTIAL</span>
                        <ExternalLink size={13} />
                      </Rise>
                    </Pop>
                  )}
                </div>                </div>
                </Rise>
              </Pop>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
