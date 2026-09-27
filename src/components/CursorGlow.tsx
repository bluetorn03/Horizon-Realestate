import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion, useIsTouchDevice } from '../hooks/useReducedMotion';

/**
 * Subtle cursor-follow indicator for fine-pointer devices.
 *
 * A small gold ring eases toward the pointer and grows when an interactive
 * element is hovered. It is decorative only (`aria-hidden`), never intercepts
 * pointer events, and is completely absent on touch devices and when the user
 * prefers reduced motion.
 */
export const CursorGlow: React.FC = () => {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const isTouch = useIsTouchDevice();
  const enabled = !reducedMotion && !isTouch;

  useEffect(() => {
    if (!enabled) return;
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let ringX = targetX;
    let ringY = targetY;
    let dotX = targetX;
    let dotY = targetY;
    let frame = 0;
    let visible = false;

    const onPointerMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      if (!visible) {
        visible = true;
        ring.style.opacity = '1';
        dot.style.opacity = '1';
      }
      const interactive = (event.target as HTMLElement | null)?.closest(
        'a, button, input, select, textarea, [role="button"], [data-cursor="hover"]',
      );
      ring.dataset.active = interactive ? 'true' : 'false';
    };

    const onPointerLeave = () => {
      visible = false;
      ring.style.opacity = '0';
      dot.style.opacity = '0';
    };

    const tick = () => {
      ringX += (targetX - ringX) * 0.14;
      ringY += (targetY - ringY) * 0.14;
      dotX += (targetX - dotX) * 0.42;
      dotY += (targetY - dotY) * 0.42;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointerleave', onPointerLeave);
    frame = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerleave', onPointerLeave);
      cancelAnimationFrame(frame);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[90] hidden lg:block">
      <div
        ref={ringRef}
        data-active="false"
        className="absolute left-0 top-0 h-9 w-9 rounded-full border border-gold-500/50 opacity-0 transition-[width,height,opacity,border-color] duration-300 ease-out data-[active=true]:h-14 data-[active=true]:w-14 data-[active=true]:border-gold-400/80"
      />
      <div
        ref={dotRef}
        className="absolute left-0 top-0 h-[5px] w-[5px] rounded-full bg-gold-500 opacity-0"
      />
    </div>
  );
};
