import React, { useState } from 'react';
import { Terminal, Send, Mail, MapPin, Copy, Check, AlertCircle, MessageSquare } from 'lucide-react';
import { personalInfo } from './data/portfolioData';
import styles from './Contact.module.css';
import Pop from './Pop';
import Rise from './Rise';

const GithubIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

/**
 * Contact Component
 * Client-side validated form (opens the visitor's email client), direct email
 * copy button, and real GitHub / LinkedIn profile links.
 */
export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [copiedEmail, setCopiedEmail] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!formData.subject.trim()) errs.subject = 'Subject is required';
    if (!formData.message.trim()) {
      errs.message = 'Message content cannot be empty';
    } else if (formData.message.trim().length < 10) {
      errs.message = 'Message must be at least 10 characters long';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // No backend — compose the message in the visitor's own email client.
    const subject = encodeURIComponent(`${formData.subject} — from ${formData.name}`);
    const body = encodeURIComponent(`${formData.message}\n\n— ${formData.name} (${formData.email})`);
    window.location.href = `mailto:${personalInfo.email}?subject=${subject}&body=${body}`;
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(personalInfo.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 3000);
  };

  return (
    <section id="contact" className="section" aria-label="Contact and Connect">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <Pop strength={4}>
            <Rise as="div" className="section-label">
              <Terminal size={14} />
              <span>05 // CONTACT & CONNECT</span>
            </Rise>
          </Pop>
          <Pop strength={11}>
            <Rise as="h2" className="section-title">
              Get in <span className="accent">touch &amp; connect</span>
            </Rise>
          </Pop>
          <Pop strength={7}>
            <Rise as="p" className="section-subtitle">
              I'm a fresher focused on AWS Cloud and DevOps, and I'm open to entry-level opportunities, internships, projects, and professional connections.
            </Rise>
          </Pop>
        </div>

        {/* Content Layout Grid */}
        <div className={styles.contactGrid}>
          
          {/* Left Column: Direct Connect & Info */}
          <div className={styles.infoCol}>
            <Rise>
            <div className={`${styles.infoCard} glass-card`}>
              <Pop strength={9} className="pop-inner">
                <Rise as="h3" className={styles.infoTitle}>
                  <Mail className={styles.iconAccent} size={20} />
                  DIRECT COMMUNICATION
                </Rise>
              </Pop>
              <Pop strength={7} className="pop-inner">
                <Rise as="p" className={styles.infoText}>
                  Feel free to email me directly or copy the address below.
                </Rise>
              </Pop>

              {/* Email Copy Box — email + copy button move as one unit */}
              <Pop strength={6} className="pop-inner">
                <div className={styles.emailBox}>
                  <span className={styles.emailText}>{personalInfo.email}</span>
                  <button 
                    className={styles.copyBtn} 
                    onClick={handleCopyEmail}
                    aria-label="Copy Email Address"
                  >
                    {copiedEmail ? <Check size={16} className={styles.iconAccent} /> : <Copy size={16} />}
                    <span>{copiedEmail ? 'COPIED' : 'COPY'}</span>
                  </button>
                </div>
              </Pop>

              {/* Contact info rows — GitHub / LinkedIn / location each
                  drift subtly and independently. */}
              <div className={styles.locationMeta}>
                <Pop strength={5} className="pop-inner">
                  <div className={styles.metaRow}>
                    <MapPin size={16} className={styles.iconAccent} />
                    <span>Coimbatore, Tamil Nadu, India</span>
                  </div>
                </Pop>
                <Pop strength={5} className="pop-inner">
                  <div className={styles.metaRow}>
                    <GithubIcon size={16} className={styles.iconAccent} />
                    <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                      github.com/Harshavardhan6705
                    </a>
                  </div>
                </Pop>
                <Pop strength={5} className="pop-inner">
                  <div className={styles.metaRow}>
                    <LinkedinIcon size={16} className={styles.iconAccent} />
                    <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                      linkedin.com/in/harshavardhan-cloud
                    </a>
                  </div>
                </Pop>
              </div>
            </div>
            </Rise>
          </div>

          {/* Right Column: Contact Form — the whole box rises as one element */}
          <Rise className="rise-stretch">
          <div className={`${styles.formCard} glass-card`}>
            <Pop strength={9} className="pop-inner">
              <h3 className={styles.formTitle}>
                <MessageSquare className={styles.iconAccent} size={20} />
                SEND A MESSAGE
              </h3>
            </Pop>

            <form onSubmit={handleSubmit} noValidate className={styles.contactForm}>
              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <Pop strength={5} className="pop-inner">
                    <Rise as="label" htmlFor="name" className={`rise-ib ${styles.label}`}>
                      YOUR NAME *
                    </Rise>
                  </Pop>
                  <Pop strength={4} className="pop-inner">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                      placeholder="e.g. Steve Rogers"
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                    />
                  </Pop>
                  {errors.name && (
                    <span id="name-error" className={styles.errorText}>
                      <AlertCircle size={12} /> {errors.name}
                    </span>
                  )}
                </div>

                <div className={styles.fieldGroup}>
                  <Pop strength={5} className="pop-inner">
                    <Rise as="label" htmlFor="email" className={`rise-ib ${styles.label}`}>
                      YOUR EMAIL *
                    </Rise>
                  </Pop>
                  <Pop strength={4} className="pop-inner">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                      placeholder="you@domain.com"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                    />
                  </Pop>
                  {errors.email && (
                    <span id="email-error" className={styles.errorText}>
                      <AlertCircle size={12} /> {errors.email}
                    </span>
                  )}
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <Pop strength={5} className="pop-inner">
                  <Rise as="label" htmlFor="subject" className={`rise-ib ${styles.label}`}>
                    SUBJECT *
                  </Rise>
                </Pop>
                <Pop strength={4} className="pop-inner">
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`${styles.input} ${errors.subject ? styles.inputError : ''}`}
                    placeholder="e.g. Entry-level opportunity / Internship"
                    aria-invalid={!!errors.subject}
                    aria-describedby={errors.subject ? 'subject-error' : undefined}
                  />
                </Pop>
                {errors.subject && (
                  <span id="subject-error" className={styles.errorText}>
                    <AlertCircle size={12} /> {errors.subject}
                  </span>
                )}
              </div>

              <div className={styles.fieldGroup}>
                <Pop strength={5} className="pop-inner">
                  <Rise as="label" htmlFor="message" className={`rise-ib ${styles.label}`}>
                    MESSAGE *
                  </Rise>
                </Pop>
                <Pop strength={4} className="pop-inner">
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className={`${styles.textarea} ${errors.message ? styles.inputError : ''}`}
                    placeholder="Tell me about the role, internship, or project..."
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                  />
                </Pop>
                {errors.message && (
                  <span id="message-error" className={styles.errorText}>
                    <AlertCircle size={12} /> {errors.message}
                  </span>
                )}
              </div>

              <Pop strength={6} className="pop-inner">
                <Rise
                  as="button"
                  type="submit"
                  className="btn-primary"
                  style={{ width: '100%', marginTop: '0.5rem' }}
                >
                  <Send size={18} />
                  <span>SEND MESSAGE</span>
                </Rise>
              </Pop>
            </form>
          </div>
          </Rise>

        </div>

      </div>
    </section>
  );
}
