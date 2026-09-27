import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowDown, ArrowUp, MoveHorizontal } from 'lucide-react';
import type { Property } from '../types';
import { usePrefersReducedMotion } from '../hooks/useReducedMotion';
import { ScrollTrigger } from '../lib/gsap';
import { PropertyCard } from './PropertyCard';

interface PropertyMarqueeProps {
  properties: Property[];
  favorites: string[];
  onSelectProperty: (property: Property) => void;
  onBookViewing: (property: Property) => void;
  onEditProperty: (property: Property) => void;
  onDeleteProperty: (property: Property) => void;
  onToggleFavorite: (id: string) => void;
}

/** Cards shown in the pinned rail — the hero inventory of the collection. */
const RAIL_LIMIT = 8;

interface CardMetric {
  left: number;
  width: number;
  element: HTMLElement;
}

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

/**
 * Scroll-velocity driven property marquee.
 *
 * The rail is pinned and its horizontal offset is derived from the section's
 * scroll progress (progress-driven, so there is no snapping or feedback loop).
 * On top of that base offset a *velocity* term is added:
 *
 *   • scrolling down  → cards travel toward the left
 *   • scrolling up    → cards travel back toward the right
 *
 * The velocity term is critically damped and clamped, so fast flicks push the
 * rail a little further and then settle back into the scrubbed position
 * instead of oscillating or running away.
 */
export const PropertyMarquee: React.FC<PropertyMarqueeProps> = ({
  properties,
  favorites,
  onSelectProperty,
  onBookViewing,
  onEditProperty,
  onDeleteProperty,
  onToggleFavorite,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const reducedMotion = usePrefersReducedMotion();
  const [direction, setDirection] = useState<'down' | 'up' | 'idle'>('idle');
  const [progressLabel, setProgressLabel] = useState(0);

  const railProperties = useMemo(
    () => (properties.length > 0 ? properties.slice(0, RAIL_LIMIT) : []),
    [properties],
  );

  const metrics = useRef<CardMetric[]>([]);
  const progress = useRef(0);
  const velocitySmooth = useRef(0);
  const offsetSmooth = useRef(0);
  const lastDirection = useRef<'down' | 'up' | 'idle'>('idle');

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    metrics.current = Array.from(track.children).map((element) => ({
      left: (element as HTMLElement).offsetLeft,
      width: (element as HTMLElement).offsetWidth,
      element: element as HTMLElement,
    }));
  }, []);

  // Re-measure once the lazy card images have decoded, otherwise the rail
  // length is wrong and the pinned distance would be incorrect.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    measure();
    const images = Array.from(track.querySelectorAll('img'));
    let pending = images.length;
    const onSettled = () => {
      pending -= 1;
      if (pending <= 0) {
        measure();
        ScrollTrigger.refresh();
      }
    };
    images.forEach((image) => {
      if (image.complete) {
        onSettled();
      } else {
        image.addEventListener('load', onSettled, { once: true });
        image.addEventListener('error', onSettled, { once: true });
      }
    });

    return () => {
      images.forEach((image) => {
        image.removeEventListener('load', onSettled);
        image.removeEventListener('error', onSettled);
      });
    };
  }, [measure, railProperties.length]);

  useEffect(() => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    const panel = panelRef.current;
    const section = sectionRef.current;
    if (!track || !viewport || !panel || !section || reducedMotion) return;

    let frame = 0;
    let distance = 1;

    const render = () => {
      const base = -progress.current * distance;
      // Positive GSAP velocity means the user is scrolling downward.
      const velocityTerm = -velocitySmooth.current * 0.055;
      const target = base + clamp(velocityTerm, -distance * 0.16, distance * 0.16);
      offsetSmooth.current += (target - offsetSmooth.current) * 0.16;

      const x = offsetSmooth.current;
      track.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0)`;

      // Per-card "open" choreography: cards rotate, lift and brighten as they
      // cross the centre of the viewport.
      const viewportWidth = viewport.clientWidth || 1;
      const centre = viewportWidth / 2;
      for (let index = 0; index < metrics.current.length; index += 1) {
        const metric = metrics.current[index];
        const cardCentre = metric.left + metric.width / 2 + x;
        const delta = (cardCentre - centre) / viewportWidth;
        const near = clamp(1 - Math.abs(delta) * 1.05, 0, 1);
        metric.element.style.setProperty('--card-opacity', (0.3 + near * 0.7).toFixed(3));
        metric.element.style.setProperty('--card-scale', (0.93 + near * 0.07).toFixed(4));
        metric.element.style.setProperty('--card-rotate', `${clamp(-delta * 7, -9, 9).toFixed(2)}deg`);
        metric.element.style.setProperty('--card-lift', `${((1 - near) * 22).toFixed(1)}px`);
      }

      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${progress.current.toFixed(4)})`;
      }

      // Park the loop once the rail has settled; `kick()` restarts it on the
      // next scroll event so nothing is ever left un-animated.
      const settled =
        Math.abs(target - offsetSmooth.current) < 0.15 && Math.abs(velocitySmooth.current) < 4;
      if (settled) {
        frame = 0;
        return;
      }
      frame = requestAnimationFrame(render);
    };

    const kick = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };

    const resetCards = () => {
      metrics.current.forEach((metric) => {
        metric.element.style.setProperty('--card-opacity', '1');
        metric.element.style.setProperty('--card-scale', '1');
        metric.element.style.setProperty('--card-rotate', '0deg');
        metric.element.style.setProperty('--card-lift', '0px');
      });
    };

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: () => {
        // Compute the travel distance here (rather than reading a cached value)
        // so the very first refresh — before `onRefresh` has ever run — already
        // pins the section for the full width of the rail.
        distance = Math.max(1, track.scrollWidth - viewport.clientWidth);
        return `+=${Math.max(distance, viewport.clientWidth * 0.9)}`;
      },
      pin: panel,
      pinSpacing: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onRefresh: () => {
        distance = Math.max(1, track.scrollWidth - viewport.clientWidth);
        measure();
        offsetSmooth.current = -progress.current * distance;
      },
      onEnter: kick,
      onEnterBack: kick,
      onLeaveBack: () => {
        progress.current = 0;
        velocitySmooth.current = 0;
        offsetSmooth.current = 0;
        track.style.transform = 'translate3d(0, 0, 0)';
        resetCards();
        if (progressBarRef.current) progressBarRef.current.style.transform = 'scaleX(0)';
      },
      onUpdate: (self) => {
        progress.current = self.progress;
        const raw = self.getVelocity();
        velocitySmooth.current += (raw - velocitySmooth.current) * 0.22;

        const nextDirection: 'down' | 'up' | 'idle' =
          Math.abs(raw) < 60 ? 'idle' : raw > 0 ? 'down' : 'up';
        if (nextDirection !== lastDirection.current) {
          lastDirection.current = nextDirection;
          setDirection(nextDirection);
        }
        setProgressLabel(Math.round(self.progress * 100));
        kick();
      },
    });

    // Relax the velocity term between scroll events so it always returns to
    // the scrubbed position instead of drifting.
    const decay = window.setInterval(() => {
      if (Math.abs(velocitySmooth.current) > 1) {
        velocitySmooth.current *= 0.9;
        kick();
      }
    }, 90);

    const onResize = () => {
      distance = Math.max(1, track.scrollWidth - viewport.clientWidth);
      measure();
      trigger.refresh();
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.clearInterval(decay);
      window.removeEventListener('resize', onResize);
      if (frame) cancelAnimationFrame(frame);
      trigger.kill();
    };
  }, [measure, reducedMotion, railProperties.length]);

  const renderCards = () =>
    railProperties.map((property) => (
      <div key={property.id} className="shrink-0">
        <PropertyCard
          property={property}
          variant="feature"
          onSelect={onSelectProperty}
          onBookViewing={onBookViewing}
          onEdit={onEditProperty}
          onDelete={onDeleteProperty}
          isFavorite={favorites.includes(property.id)}
          onToggleFavorite={onToggleFavorite}
        />
      </div>
    ));

  const header = (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.28em] text-gold-400">
          The Signature Collection
        </p>
        <h2 className="max-w-xl font-display text-3xl font-bold leading-tight text-bone-50 sm:text-4xl lg:text-5xl">
          Residences that travel with your scroll
        </h2>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-bone-400">
          Scroll down and the collection opens from the left; scroll up and it returns from the
          right — the rail responds to the direction and speed of your scroll.
        </p>
      </div>

      <div
        className="flex items-center gap-3 self-start rounded-full border border-bone-100/15 bg-white/5 px-4 py-2.5 backdrop-blur-sm lg:self-auto"
        aria-live="polite"
      >
        <span
          className={`grid h-8 w-8 place-items-center rounded-full border transition-colors duration-300 ${
            direction === 'down'
              ? 'border-gold-400/60 bg-gold-500/15 text-gold-300'
              : direction === 'up'
                ? 'border-bone-100/30 bg-white/10 text-bone-100'
                : 'border-bone-100/15 text-bone-400'
          }`}
        >
          {direction === 'up' ? (
            <ArrowUp className="h-4 w-4" />
          ) : direction === 'down' ? (
            <ArrowDown className="h-4 w-4" />
          ) : (
            <MoveHorizontal className="h-4 w-4" />
          )}
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-bone-300">
          {direction === 'down'
            ? 'Opening from the left'
            : direction === 'up'
              ? 'Returning from the right'
              : 'Scroll to explore'}
        </span>
      </div>
    </div>
  );

  if (railProperties.length === 0) return null;

  /* ------------------------------------------------------------------
     Reduced-motion / no-animation fallback: a calm, natively scrollable
     rail. No pinning, no velocity term — fully readable and usable.
     ------------------------------------------------------------------ */
  if (reducedMotion) {
    return (
      <section
        id="collection-marquee"
        className="bg-ink-950 py-20 text-bone-100"
        aria-label="Featured property collection"
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-8">
          {header}
          <div className="scrollbar-none mt-12 flex gap-6 overflow-x-auto pb-6">{renderCards()}</div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="collection-marquee"
      ref={sectionRef}
      className="relative bg-ink-950 text-bone-100"
      aria-label="Featured property collection"
    >
      <div
        ref={panelRef}
        className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          aria-hidden="true"
          style={{
            background:
              'radial-gradient(90% 60% at 20% 0%, rgba(176,141,63,0.16), transparent 60%), radial-gradient(70% 60% at 90% 100%, rgba(70,88,122,0.22), transparent 65%)',
          }}
        />

        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-8">
          <div className="pb-8">{header}</div>
        </div>

        <div ref={viewportRef} className="relative w-full overflow-hidden py-6">
          <div ref={trackRef} className="flex gap-6 px-4 will-change-transform sm:px-8">
            {renderCards()}
          </div>
        </div>

        <div className="relative mx-auto mt-8 w-full max-w-7xl px-4 sm:px-8">
          <div className="h-[2px] w-full overflow-hidden rounded-full bg-bone-100/15">
            <div
              ref={progressBarRef}
              className="h-full w-full origin-left bg-gold-400"
              style={{ transform: 'scaleX(0)' }}
            />
          </div>
          <div className="mt-3 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.22em] text-bone-500">
            <span>{railProperties.length} curated residences</span>
            <span className="tabular-nums">{String(progressLabel).padStart(2, '0')}%</span>
          </div>
        </div>
      </div>
    </section>
  );
};
