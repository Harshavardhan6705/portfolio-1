import React from 'react';
import { Terminal, ZoomIn, ExternalLink } from 'lucide-react';
import { projectsData, personalInfo } from './data/portfolioData';
import Rise, { useRise } from './Rise';
import usePopMotion from './usePopMotion';
import Pop from './Pop';
import styles from './Projects.module.css';

const GithubIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

/**
 * Reveal — generic wrapper giving ANY element its own independent
 * Canva-style "Rise" entrance (replaces the old reveal-pop system).
 * Every instance runs its own IntersectionObserver, so elements rise
 * individually as they enter the viewport — never as a synchronized
 * group, never off a shared timeline.
 */
function Reveal({ as: Tag = 'div', className = '', children, ...rest }) {
  const [ref, isVisible] = useRise();
  return (
    <Tag
      ref={ref}
      className={`rise ${isVisible ? 'rise-visible' : ''} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/**
 * ActionButton — CODE / LIVE DEMO button, each with its own Rise
 * trigger AND its own pop-motion instance (inside the rise element, so
 * the two transforms never overwrite each other).
 */
function ActionButton({ href, onClick, primary = false, icon, children }) {
  const [ref, isVisible] = useRise();
  const motionRef = usePopMotion({ strength: 6 }); // callback ref
  return (
    <a
      ref={ref}
      href={href}
      onClick={onClick}
      target={href ? '_blank' : undefined}
      rel={href ? 'noopener noreferrer' : undefined}
      className={`${styles.actionBtn} ${primary ? styles.actionBtnPrimary : ''} rise ${isVisible ? 'rise-visible' : ''}`}
    >
      <span ref={motionRef} className="pop-flex">
        {icon}
        {children}
      </span>
    </a>
  );
}

/**
 * A single project card. This component is fully self-contained: the
 * card and EVERY internal element (image, badge, title, tagline,
 * description, tags, buttons) each hold their own observer and state.
 * Two rendered cards share NOTHING — Project 2 animates even if the
 * user jumps straight to it and Project 1 was never seen.
 */
function ProjectCard({ project, onOpenLightbox }) {
  const [cardRef, isCardVisible] = useRise();
  // Own pop-motion instance per card image (strongest strength in the system) —
  // Project 2 works even if Project 1 was never in the viewport.
  const popRef = usePopMotion({ strength: 24 });

  return (
    <article
      ref={cardRef}
      className={`${styles.projectCard} glass-card rise ${isCardVisible ? 'rise-visible' : ''}`}
    >
      {/* Project image — own independent rise, own independent pop motion.
          The Reveal wrapper owns opacity/rise; the inner pop layer
          owns the continuous scroll translate, so the two transforms
          never overwrite each other. */}
      <Reveal
        className={styles.imageContainer}
        onClick={() => onOpenLightbox({
          src: project.fullImage || project.image,
          title: project.title,
          caption: project.description,
          tags: project.tags
        })}
      >
        <div className={styles.parallaxLayer} ref={popRef}>
          <img
            src={project.image}
            alt={project.title}
            className={styles.projectImg}
            loading="lazy"
          />
        </div>
        <div className={styles.imageOverlay}>
          <ZoomIn size={26} />
          <span>OPEN LIGHTBOX GALLERY</span>
        </div>

        {/* Category badge — own independent rise + own pop strength.
            It is absolutely positioned against the image container, so it
            lives outside the image's pop layer. */}
        <Pop strength={10} className="pop-flex">
          <Reveal as="span" className={styles.categoryBadge}>
            {project.category}
          </Reveal>
        </Pop>
      </Reveal>

        {/* Card Body */}
      <div className={styles.cardContent}>
        {/* Title — own independent rise + own pop strength */}
        <Reveal as="h3" className={styles.projectTitle}>
          <Pop as="span" strength={11} className="pop-inner">{project.title}</Pop>
        </Reveal>

        {/* Short highlighted description — own rise + own pop strength */}
        <Reveal as="p" className={styles.projectTagline}>
          <Pop as="span" strength={8} className="pop-inner">{project.tagline}</Pop>
        </Reveal>

        {/* Full description — own rise + own pop strength */}
        <Reveal as="p" className={styles.projectDesc}>
          <Pop as="span" strength={7} className="pop-inner">{project.description}</Pop>
        </Reveal>

        {/* Technology tags — own rise + own pop strength */}
        <Reveal className={styles.tagsRow}>
          <Pop strength={6} className="pop-inner">
            {project.tags.map((tag, tIdx) => (
              <span key={tIdx} className="badge">
                {tag}
              </span>
            ))}
          </Pop>
        </Reveal>

        {/* Actions — CODE and LIVE DEMO each reveal independently, each
            with its own subtle pop motion (ActionButton owns it). */}
        <div className={styles.actionsRow}>
          <ActionButton
            href={project.repoUrl || personalInfo.github}
            icon={<GithubIcon size={15} />}
          >
            CODE
          </ActionButton>
          <ActionButton
            primary
            onClick={() => onOpenLightbox({
              src: project.fullImage || project.image,
              title: project.title,
              caption: project.description,
              tags: project.tags
            })}
            icon={<ExternalLink size={15} />}
          >
            LIVE DEMO
          </ActionButton>
        </div>
      </div>
    </article>
  );
}

/**
 * Projects Component
 * Real, resume-faithful project cards.
 * Every major element — label, heading, description, card image, badge,
 * and text details — uses the shared per-element scroll-direction pop motion.
 */
export default function Projects({ onOpenLightbox }) {
  return (
    <section
      id="projects"
      className="section"
      aria-label="Projects & Case Studies"
    >
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          {/* 1. Section label */}
          <Pop strength={5}>
            <Rise as="div" className="section-label">
              <Terminal size={14} />
              <span>03 // PORTFOLIO & CASE STUDIES</span>
            </Rise>
          </Pop>

          {/* 2. Main heading */}
          <Pop strength={12}>
            <Rise as="h2" className="section-title">
              Projects &amp; <span className="accent">practical builds</span>
            </Rise>
          </Pop>

          {/* 3. Description */}
          <Pop strength={7}>
            <Rise as="p" className="section-subtitle">
              Hands-on projects built while learning — applying cloud, security, and AI concepts to real, working tools.
            </Rise>
          </Pop>
        </div>

        {/* Project Cards Grid */}
        <div className="grid-cards">
          {projectsData.map((project) => (
            <ProjectCard key={project.id} project={project} onOpenLightbox={onOpenLightbox} />
          ))}
        </div>
      </div>

      {/* No-JS fallback: nothing may stay hidden */}
      <noscript>
        <style>{`
          .${styles.projectCard}, .rise { opacity: 1 !important; transform: none !important; }
        `}</style>
      </noscript>
    </section>
  );
}
