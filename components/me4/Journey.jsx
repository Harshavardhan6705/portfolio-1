import React from 'react';
import { Terminal, Calendar, GraduationCap } from 'lucide-react';
import { learningJourney } from './data/portfolioData';
import styles from './Journey.module.css';
import Pop from './Pop';
import Rise from './Rise';

/**
 * Journey Component
 * Education timeline: college and higher secondary schooling only.
 */
export default function Journey() {
  return (
    <section id="timeline" className="section" aria-label="Evolution & Timeline">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <Pop strength={4}>
            <Rise as="div" className="section-label">
              <Terminal size={14} />
              <span>04 // EVOLUTION & TIMELINE</span>
            </Rise>
          </Pop>
          <Pop strength={11}>
            <Rise as="h2" className="section-title">
              Education <span className="accent">&amp; timeline</span>
            </Rise>
          </Pop>
          <Pop strength={7}>
            <Rise as="p" className="section-subtitle">
              Academic journey from higher secondary schooling to my B.Sc. degree.
            </Rise>
          </Pop>
        </div>

        {/* Vertical Timeline */}
        <div className={styles.timelineWrapper}>
          <div className={styles.timelineLine} />

          {learningJourney.map((item, idx) => (
            <Pop key={idx} strength={5} className="pop-stretch">
              <Rise>
              <div className={styles.timelineItem}>
                {/* Year Marker Badge */}
                <div className={styles.markerContainer}>
                  <div className={styles.markerDot}>
                    <Calendar size={14} />
                  </div>
                </div>

                {/* Content Card — year/title/description drift at their
                    own speeds inside the independently-moving entry. */}
                <div className={`${styles.timelineCard} glass-card`}>
                  <Pop strength={8} className="pop-inner">
                    <Rise as="span" className={styles.yearTag}>{item.year}</Rise>
                  </Pop>
                  <Pop strength={10} className="pop-inner">
                    <Rise as="h3" className={styles.roleTitle}>{item.role}</Rise>
                  </Pop>
                  <Pop strength={6} className="pop-inner">
                    <Rise as="p" className={styles.milestoneTag}>
                      <GraduationCap size={14} style={{ marginRight: '6px', verticalAlign: '-2px' }} />
                      {item.milestone}
                    </Rise>
                  </Pop>
                  <Pop strength={7} className="pop-inner">
                    <Rise as="p" className={styles.descText}>{item.description}</Rise>
                  </Pop>
                </div>
              </div>
              </Rise>
            </Pop>
          ))}
        </div>

      </div>
    </section>
  );
}
