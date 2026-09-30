'use client';

import '../app/me4.css';
import Me4App from './me4/Me4App';

/**
 * HvPageClient
 * Renders the complete `me 4` portfolio page (PAGE 2) with its original design
 * system scoped under .hv-page so it cannot affect the glass hero (PAGE 1).
 */
export default function HvPageClient() {
  return (
    <div className="hv-page">
      <Me4App />
    </div>
  );
}
