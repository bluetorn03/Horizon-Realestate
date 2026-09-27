import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion, useIsTouchDevice } from './useReducedMotion';

interface MagneticOptions {
  /** How far the element travels toward the cursor, in pixels. */
  strength?: number;
  /** Inner label travel — gives the premium "pull" feel. */
  labelStrength?: number;
}

/**
 * Magnetic call-to-action.
 *
 * Moves the button toward the pointer and its inner label a little further,
 * both written as CSS custom properties so React never re-renders.
 */
export function useMagnetic<T extends HTMLElement>(options: MagneticOptions = {}) {
  const { strength = 14, labelStrength = 7 } = options;
  const ref = useRef<T | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const isTouch = useIsTouchDevice();
  const enabled = !reducedMotion && !isTouch;

  useEffect(() => {
    const element = ref.current;
    if (!element || !enabled) return;

    let frame = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let active = false;

    const write = () => {
      element.style.setProperty('--mag-x', `${cx.toFixed(2)}px`);
      element.style.setProperty('--mag-y', `${cy.toFixed(2)}px`);
      element.style.setProperty('--mag-label-x', `${(cx * (labelStrength / strength)).toFixed(2)}px`);
      element.style.setProperty('--mag-label-y', `${(cy * (labelStrength / strength)).toFixed(2)}px`);
    };

    const tick = () => {
      cx += (tx - cx) * 0.16;
      cy += (ty - cy) * 0.16;
      write();
      const settled = Math.abs(tx - cx) < 0.1 && Math.abs(ty - cy) < 0.1;
      if (settled && !active) {
        frame = 0;
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      tx = Math.max(-1, Math.min(1, dx / (rect.width / 2))) * strength;
      ty = Math.max(-1, Math.min(1, dy / (rect.height / 2))) * strength;
      active = true;
      start();
    };

    const onPointerLeave = () => {
      active = false;
      tx = 0;
      ty = 0;
      start();
    };

    const onPointerEnter = () => {
      active = true;
    };

    element.addEventListener('pointerenter', onPointerEnter);
    element.addEventListener('pointermove', onPointerMove);
    element.addEventListener('pointerleave', onPointerLeave);
    element.addEventListener('pointercancel', onPointerLeave);

    return () => {
      element.removeEventListener('pointerenter', onPointerEnter);
      element.removeEventListener('pointermove', onPointerMove);
      element.removeEventListener('pointerleave', onPointerLeave);
      element.removeEventListener('pointercancel', onPointerLeave);
      if (frame) cancelAnimationFrame(frame);
      element.style.removeProperty('--mag-x');
      element.style.removeProperty('--mag-y');
      element.style.removeProperty('--mag-label-x');
      element.style.removeProperty('--mag-label-y');
    };
  }, [enabled, labelStrength, strength]);

  return ref;
}
