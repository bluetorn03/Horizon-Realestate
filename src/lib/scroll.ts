/**
 * Smooth scrolling (Lenis) wired into the GSAP ticker, plus scroll-lock and
 * section-navigation helpers used by the whole app.
 *
 * Lenis performs real scrolling (it never hijacks the wheel), so ScrollTrigger
 * keeps working natively; we only forward its scroll events and drive its
 * rAF loop from the GSAP ticker to keep a single, perfectly synced clock.
 */
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsap';

let lenisInstance: Lenis | null = null;
let tickerAttached = false;

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
  );
}

/**
 * Create (once) and return the global Lenis instance.
 * Returns `null` when the user prefers reduced motion — callers must fall
 * back to native scrolling in that case.
 */
export function getLenis(): Lenis | null {
  if (typeof window === 'undefined') return null;
  if (lenisInstance) return lenisInstance;
  if (prefersReducedMotion()) return null;

  try {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1.4,
    });

    // Keep ScrollTrigger perfectly in sync with the smoothed scroll position.
    lenis.on('scroll', ScrollTrigger.update);

    if (!tickerAttached) {
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
      tickerAttached = true;
    }

    // Recalculate pinned sections once fonts/images settle.
    if (document.readyState === 'complete') {
      ScrollTrigger.refresh();
    } else {
      window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
    }

    lenisInstance = lenis;
    return lenisInstance;
  } catch (error) {
    console.warn('Smooth scrolling unavailable, falling back to native scroll.', error);
    return null;
  }
}

/** Stop the page from scrolling (used behind modals). */
export function lockScroll(): void {
  const lenis = getLenis();
  if (lenis) {
    lenis.stop();
    return;
  }
  document.body.style.overflow = 'hidden';
}

/** Restore scrolling. */
export function unlockScroll(): void {
  const lenis = getLenis();
  if (lenis) {
    lenis.start();
    return;
  }
  document.body.style.overflow = '';
}

/** Smoothly scroll to an element id, respecting reduced-motion preferences. */
export function scrollToSection(sectionId: string, offset = 0): void {
  if (typeof document === 'undefined') return;
  const target = document.getElementById(sectionId);
  if (!target) return;

  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(target, { offset, duration: 1.2 });
    return;
  }
  const top = target.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
}

/** Scroll to the very top (brand logo). */
export function scrollToTop(): void {
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(0, { duration: 1.2 });
    return;
  }
  window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
}

/** Recalculate all ScrollTrigger positions (call after layout changes). */
export function refreshScrollTriggers(): void {
  ScrollTrigger.refresh();
}
