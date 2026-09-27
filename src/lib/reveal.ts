/**
 * Declarative scroll-choreography layer.
 *
 * Components opt in with data attributes; this module owns every GSAP
 * ScrollTrigger so there is a single source of truth for timing and easing:
 *
 *   data-reveal="up|down|fade|scale|mask|left|right"
 *   data-reveal-stagger        -> children [data-reveal-item] animate in sequence
 *   data-split="words|chars"   -> character/word level heading reveal
 *   data-parallax="0.25"       -> depth based image movement (multiplier)
 *   data-zoom="in|out"         -> image zoom on entry / exit
 *
 * Everything is skipped when the user prefers reduced motion, and elements are
 * never left in a hidden state: the library only ever animates *from* a state
 * and returns to the natural DOM state.
 */
import { gsap, ScrollTrigger } from './gsap';

export type RevealKind = 'up' | 'down' | 'fade' | 'scale' | 'mask' | 'left' | 'right';

interface SplitState {
  element: HTMLElement;
  original: string;
}

const splitRegistry: SplitState[] = [];

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
  );
}

/** Wrap each word (and optionally character) of an element in a clipped span. */
function splitText(element: HTMLElement, mode: 'words' | 'chars'): void {
  const original = element.textContent ?? '';
  if (!original.trim()) return;
  if (element.dataset.splitReady === 'true') return;

  const words = original.split(/(\s+)/).filter((chunk) => chunk.length > 0);
  const fragment = document.createDocumentFragment();

  words.forEach((chunk) => {
    if (/^\s+$/.test(chunk)) {
      fragment.appendChild(document.createTextNode(chunk));
      return;
    }
    const wordSpan = document.createElement('span');
    wordSpan.style.display = 'inline-block';
    wordSpan.style.overflow = 'hidden';
    wordSpan.style.verticalAlign = 'bottom';

    if (mode === 'chars') {
      const inner = document.createElement('span');
      inner.style.display = 'inline-block';
      for (const char of Array.from(chunk)) {
        const charSpan = document.createElement('span');
        charSpan.style.display = 'inline-block';
        charSpan.textContent = char;
        inner.appendChild(charSpan);
      }
      wordSpan.appendChild(inner);
      fragment.appendChild(wordSpan);
      return;
    }

    const inner = document.createElement('span');
    inner.style.display = 'inline-block';
    inner.textContent = chunk;
    wordSpan.appendChild(inner);
    fragment.appendChild(wordSpan);
  });

  element.textContent = '';
  element.appendChild(fragment);
  element.dataset.splitReady = 'true';
  splitRegistry.push({ element, original });
}

function revealFromVars(kind: RevealKind): gsap.TweenVars {
  switch (kind) {
    case 'down':
      return { yPercent: -18, opacity: 0 };
    case 'left':
      return { xPercent: -12, opacity: 0 };
    case 'right':
      return { xPercent: 12, opacity: 0 };
    case 'fade':
      return { opacity: 0 };
    case 'scale':
      return { scale: 0.92, opacity: 0 };
    case 'mask':
      return { clipPath: 'inset(0% 0% 100% 0%)', yPercent: 8, opacity: 0 };
    case 'up':
    default:
      return { yPercent: 14, opacity: 0 };
  }
}

function initSplitElements(): void {
  document.querySelectorAll<HTMLElement>('[data-split]').forEach((element) => {
    const mode = element.dataset.split === 'chars' ? 'chars' : 'words';
    splitText(element, mode);
  });
}

function initReveals(): void {
  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((element) => {
    if (element.dataset.revealInit === 'true') return;
    element.dataset.revealInit = 'true';
    const kind = (element.dataset.reveal as RevealKind) || 'up';
    const delay = Number.parseFloat(element.dataset.revealDelay ?? '0');

    gsap.from(element, {
      ...revealFromVars(kind),
      duration: 1.05,
      delay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 88%',
        once: true,
      },
    });
  });

  document.querySelectorAll<HTMLElement>('[data-reveal-stagger]').forEach((container) => {
    if (container.dataset.revealInit === 'true') return;
    container.dataset.revealInit = 'true';
    const items = container.querySelectorAll<HTMLElement>('[data-reveal-item]');
    if (items.length === 0) return;

    gsap.from(items, {
      yPercent: 18,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      stagger: 0.09,
      scrollTrigger: {
        trigger: container,
        start: 'top 82%',
        once: true,
      },
    });
  });

  document.querySelectorAll<HTMLElement>('[data-split]').forEach((element) => {
    if (element.dataset.splitAnimInit === 'true') return;
    element.dataset.splitAnimInit = 'true';
    const targets = element.querySelectorAll<HTMLElement>('span > span');
    if (targets.length === 0) return;

    gsap.from(targets, {
      yPercent: 118,
      duration: 1.1,
      ease: 'power4.out',
      stagger: 0.035,
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        once: true,
      },
    });
  });

  document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((element) => {
    if (element.dataset.parallaxInit === 'true') return;
    element.dataset.parallaxInit = 'true';
    const strength = Number.parseFloat(element.dataset.parallax ?? '0.2');
    const clamped = Math.max(-1, Math.min(1, strength));

    gsap.fromTo(
      element,
      { yPercent: clamped * 14 },
      {
        yPercent: clamped * -14,
        ease: 'none',
        scrollTrigger: {
          trigger: element.closest('[data-parallax-scope]') ?? element,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      },
    );
  });

  document.querySelectorAll<HTMLElement>('[data-zoom]').forEach((element) => {
    if (element.dataset.zoomInit === 'true') return;
    element.dataset.zoomInit = 'true';
    const direction = element.dataset.zoom === 'out' ? 1.18 : 1.22;

    gsap.fromTo(
      element,
      { scale: direction },
      {
        scale: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: element.closest('[data-zoom-scope]') ?? element,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      },
    );
  });
}

/**
 * Initialise every choreography hook present in the DOM.
 * Safe to call repeatedly — already-initialised nodes are skipped.
 */
export function initScrollAnimations(): void {
  if (typeof window === 'undefined') return;
  if (prefersReducedMotion()) return;

  initSplitElements();
  initReveals();
  ScrollTrigger.refresh();
}

/** Revert split-text mutations (used when hot-reloading / unmounting). */
export function resetScrollAnimations(): void {
  splitRegistry.forEach(({ element, original }) => {
    element.textContent = original;
    element.dataset.splitReady = 'false';
    element.dataset.splitAnimInit = 'false';
  });
  splitRegistry.length = 0;
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
}
