/**
 * GSAP singleton + plugin registration.
 *
 * Import `gsap` / `ScrollTrigger` from here everywhere so the plugin is
 * registered exactly once and the same instance is shared with the Lenis
 * smooth-scroll ticker (see `./scroll`).
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

/** Shared ease used across the site for a calm, expensive feel. */
export const EASE_LUX = 'power3.out';
export const EASE_IN_OUT = 'power2.inOut';
