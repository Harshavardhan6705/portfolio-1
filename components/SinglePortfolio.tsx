'use client';

import GlassHero from './glass-hero';
import Me4App from './me4/Me4App';
import '../app/me4.css';

/**
 * SinglePortfolio
 * One continuous portfolio page with the redesigned First Page / Hero section
 * and the complete portfolio directly below it in the same DOM.
 */
export default function SinglePortfolio() {
  return (
    <div className="single-portfolio hv-page">
      <GlassHero />
      <Me4App showHero={false} fixedOverlaysVisible={true} />
    </div>
  );
}
