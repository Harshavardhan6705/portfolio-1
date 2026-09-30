import React, { useEffect } from 'react';
import { X, ExternalLink, Tag } from 'lucide-react';
import styles from './LightboxModal.module.css';

const GithubIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

/**
 * LightboxModal Component
 * Interactive image lightbox gallery for architecture diagrams and project screenshots.
 * Supports backdrop close, Esc keyboard navigation, and high-res preview.
 */
export default function LightboxModal({ isOpen, onClose, item }) {
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

  if (!isOpen || !item) return null;

  return (
    <div className={styles.modalOverlay} role="dialog" aria-modal="true" aria-label={item.title}>
      <div className={styles.backdrop} onClick={onClose} />
      
      <div className={styles.modalContent}>
        {/* Modal Close Button */}
        <button 
          className={styles.closeBtn} 
          onClick={onClose} 
          aria-label="Close Lightbox"
        >
          <X size={22} />
        </button>

        {/* Main Image Frame */}
        <div className={styles.imageFrame}>
          <img 
            src={item.src} 
            alt={item.title} 
            className={styles.modalImg} 
          />
        </div>

        {/* Metadata Footer */}
        <div className={styles.modalInfo}>
          <div className={styles.infoText}>
            <h3 className={styles.modalTitle}>{item.title}</h3>
            {item.caption && <p className={styles.modalCaption}>{item.caption}</p>}
          </div>

          {item.tags && (
            <div className={styles.tagsRow}>
              {item.tags.map((t, idx) => (
                <span key={idx} className="badge badge-accent">
                  <Tag size={11} style={{ marginRight: '4px' }} />
                  {t}
                </span>
              ))}
            </div>
          )}

          <div className={styles.modalActions}>
            {item.github && (
              <a href={item.github} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                <GithubIcon size={16} />
                <span>REPOSITORY</span>
              </a>
            )}
            {item.demo && (
              <a href={item.demo} target="_blank" rel="noopener noreferrer" className="btn-primary">
                <ExternalLink size={16} />
                <span>LIVE SYSTEM</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
