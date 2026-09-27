import { useEffect } from 'react';
import { lockScroll, unlockScroll } from '../lib/scroll';

/**
 * Lock background scrolling while an overlay is open and restore it on close.
 * Works with both Lenis smooth scrolling and native scrolling.
 */
export function useScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active) return;
    lockScroll();
    return () => unlockScroll();
  }, [active]);
}
