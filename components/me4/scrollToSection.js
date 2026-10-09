/**
 * scrollToSection — in-page smooth scrolling for the single-page portfolio.
 *
 * Scrolls to a section on the CURRENT page. No routes, no reloads, no new
 * tabs. Double-rAF ensures layout has settled (e.g. right after a nav
 * overlay unmounts and body scroll is restored) before measuring.
 *
 * Lands the section's CONTENT (past its top padding) just below the fixed
 * header, so the section fills the screen instead of showing the tail of
 * the previous section behind the header.
 */
const GAP_BELOW_HEADER = 24;

export default function scrollToSection(sectionId) {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const el = document.getElementById(sectionId);
      if (!el) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const paddingTop = parseFloat(getComputedStyle(el).paddingTop) || 0;
      const header = document.querySelector('header');
      const headerBottom = header ? header.getBoundingClientRect().bottom : 0;
      const contentTop = el.getBoundingClientRect().top + window.scrollY + paddingTop;
      const top = Math.max(0, contentTop - headerBottom - GAP_BELOW_HEADER);
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}
