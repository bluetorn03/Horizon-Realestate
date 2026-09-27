import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion, useIsTouchDevice } from './useReducedMotion';

interface TiltOptions {
  /** Maximum rotation in degrees on each axis. */
  max?: number;
  /** Scale applied while the pointer is over the element. */
  hoverScale?: number;
  /** Perspective in pixels. */
  perspective?: number;
}

interface TiltState {
  rx: number;
  ry: number;
  scale: number;
  glowX: number;
  glowY: number;
}

const IDENTITY: TiltState = { rx: 0, ry: 0, scale: 1, glowX: 50, glowY: 50 };

/**
 * GPU-friendly 3D hover tilt.
 *
 * The hook writes CSS custom properties (`--tilt-rx`, `--tilt-ry`, …) on the
 * element instead of re-rendering React, and eases toward the target inside a
 * single requestAnimationFrame loop so there is exactly one transform write
 * per frame.
 */
export function useTilt3D<T extends HTMLElement>(options: TiltOptions = {}) {
  const { max = 7, hoverScale = 1.015, perspective = 1000 } = options;
  const ref = useRef<T | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const isTouch = useIsTouchDevice();
  const enabled = !reducedMotion && !isTouch;

  useEffect(() => {
    const element = ref.current;
    if (!element || !enabled) return;

    const target: TiltState = { ...IDENTITY };
    const current: TiltState = { ...IDENTITY };
    let frame = 0;
    let active = false;

    const write = () => {
      element.style.setProperty('--tilt-perspective', `${perspective}px`);
      element.style.setProperty('--tilt-rx', `${current.rx.toFixed(2)}deg`);
      element.style.setProperty('--tilt-ry', `${current.ry.toFixed(2)}deg`);
      element.style.setProperty('--tilt-scale', current.scale.toFixed(4));
      element.style.setProperty('--glare-x', `${current.glowX.toFixed(1)}%`);
      element.style.setProperty('--glare-y', `${current.glowY.toFixed(1)}%`);
    };

    const tick = () => {
      const ease = 0.12;
      current.rx += (target.rx - current.rx) * ease;
      current.ry += (target.ry - current.ry) * ease;
      current.scale += (target.scale - current.scale) * ease;
      current.glowX += (target.glowX - current.glowX) * ease;
      current.glowY += (target.glowY - current.glowY) * ease;
      write();

      const settled =
        Math.abs(target.rx - current.rx) < 0.02 &&
        Math.abs(target.ry - current.ry) < 0.02 &&
        Math.abs(target.scale - current.scale) < 0.0005;

      if (settled && !active) {
        frame = 0;
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (frame) return;
      active = true;
      frame = requestAnimationFrame(tick);
    };

    const stop = () => {
      active = false;
      Object.assign(target, IDENTITY);
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      target.ry = (px - 0.5) * 2 * max;
      target.rx = (0.5 - py) * 2 * max;
      target.scale = hoverScale;
      target.glowX = px * 100;
      target.glowY = py * 100;
      start();
    };

    const onPointerEnter = () => {
      target.scale = hoverScale;
      start();
    };

    element.addEventListener('pointerenter', onPointerEnter);
    element.addEventListener('pointermove', onPointerMove);
    element.addEventListener('pointerleave', stop);
    element.addEventListener('pointercancel', stop);

    return () => {
      element.removeEventListener('pointerenter', onPointerEnter);
      element.removeEventListener('pointermove', onPointerMove);
      element.removeEventListener('pointerleave', stop);
      element.removeEventListener('pointercancel', stop);
      if (frame) cancelAnimationFrame(frame);
      element.style.removeProperty('--tilt-rx');
      element.style.removeProperty('--tilt-ry');
      element.style.removeProperty('--tilt-scale');
      element.style.removeProperty('--glare-x');
      element.style.removeProperty('--glare-y');
    };
  }, [enabled, hoverScale, max, perspective]);

  return ref;
}
