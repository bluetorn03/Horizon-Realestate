import { useEffect, useRef, useState } from 'react';

interface UseInViewOptions {
  /** Fraction of the element that must be visible. */
  threshold?: number;
  /** Pixels before the element enters the viewport to start observing. */
  rootMargin?: string;
  /** Keep the flag true after the first intersection (default) or toggle. */
  once?: boolean;
}

/**
 * IntersectionObserver based visibility flag.
 * Used to defer mounting heavy WebGL scenes until they are actually close to
 * the viewport, keeping the initial bundle and first paint light.
 */
export function useInView<T extends HTMLElement>(options: UseInViewOptions = {}) {
  const { threshold = 0.15, rootMargin = '200px 0px', once = true } = options;
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            if (once) observer.disconnect();
          } else if (!once) {
            setInView(false);
          }
        });
      },
      { threshold, rootMargin },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [once, rootMargin, threshold]);

  return { ref, inView };
}
