/**
 * scrollToSection — in-page smooth scrolling for the single-page portfolio.
 *
 * Scrolls to a section on the CURRENT page. No routes, no reloads, no new
 * tabs. Double-rAF ensures layout has settled (e.g. right after a nav
 * overlay unmounts and body scroll is restored) before measuring.
 */
export default function scrollToSection(sectionId) {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });
}
