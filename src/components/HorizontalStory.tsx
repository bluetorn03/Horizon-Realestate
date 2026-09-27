import React, { useCallback, useEffect, useRef } from 'react';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { INDIAN_CITIES } from '../lib/locations';
import { unsplashUrl } from '../lib/images';
import { formatINRCompact } from '../lib/format';
import { usePrefersReducedMotion } from '../hooks/useReducedMotion';
import { ScrollTrigger } from '../lib/gsap';

interface HorizontalStoryProps {
  onSelectLocation: (city: string) => void;
}

const CITIES = INDIAN_CITIES.slice(0, 6);

/**
 * Pinned horizontal storytelling rail across India's prime micro-markets.
 *
 * Progress is driven by ScrollTrigger (never by wheel deltas directly), so the
 * rail can never oscillate or run away, and inner photography carries an
 * opposite-direction parallax for depth.
 */
export const HorizontalStory: React.FC<HorizontalStoryProps> = ({ onSelectLocation }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  const applyParallax = useCallback((progress: number) => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!track || !viewport) return;
    const distance = Math.max(1, track.scrollWidth - viewport.clientWidth);
    const x = -progress * distance;
    track.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0)`;

    Array.from(track.children).forEach((child) => {
      const panel = child as HTMLElement;
      const panelCentre = panel.offsetLeft + panel.offsetWidth / 2 + x;
      const delta = (panelCentre - viewport.clientWidth / 2) / viewport.clientWidth;
      const image = panel.querySelector<HTMLElement>('[data-story-image]');
      if (image) {
        image.style.transform = `translate3d(${(delta * -9).toFixed(2)}%, 0, 0) scale(1.14)`;
      }
    });
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const panel = panelRef.current;
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!section || !panel || !track || !viewport || reducedMotion) return;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: () => `+=${Math.max(1, track.scrollWidth - viewport.clientWidth)}`,
      pin: panel,
      pinSpacing: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      scrub: true,
      onRefresh: () => applyParallax(0),
      onUpdate: (self) => applyParallax(self.progress),
      onLeaveBack: () => applyParallax(0),
    });

    return () => {
      trigger.kill();
      track.style.transform = 'translate3d(0, 0, 0)';
    };
  }, [applyParallax, reducedMotion]);

  const panels = CITIES.map((city, index) => (
    <article
      key={city.name}
      className="relative flex h-full w-[86vw] shrink-0 flex-col justify-end overflow-hidden rounded-2xl border border-bone-100/10 sm:w-[62vw] lg:w-[46vw]"
    >
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <img
          data-story-image
          src={unsplashUrl(city.imageId, { width: 1400, quality: 78 })}
          alt=""
          width={1400}
          height={1000}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover will-change-transform"
        />
      </div>
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            'linear-gradient(180deg, rgba(6,11,22,0.15) 0%, rgba(6,11,22,0.35) 45%, rgba(6,11,22,0.92) 100%)',
        }}
      />

      <div className="relative p-7 sm:p-10">
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-gold-300">
          {String(index + 1).padStart(2, '0')} · {city.state}
        </p>
        <h3 className="mt-3 font-display text-3xl font-bold text-bone-50 sm:text-4xl">
          {city.name}
        </h3>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-bone-300">{city.blurb}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {city.microMarkets.slice(0, 4).map((market) => (
            <span
              key={market}
              className="rounded-full border border-bone-100/20 bg-white/5 px-3 py-1 text-[11px] font-medium text-bone-200 backdrop-blur-sm"
            >
              {market}
            </span>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="text-[11px] uppercase tracking-[0.18em] text-bone-400">
            Indicative{' '}
            <span className="font-semibold text-bone-100">
              {formatINRCompact(city.indicativeRatePerSqft[0])} –{' '}
              {formatINRCompact(city.indicativeRatePerSqft[1])}
            </span>{' '}
            / sq ft
          </div>
          <button
            type="button"
            onClick={() => onSelectLocation(city.name)}
            className="group inline-flex items-center gap-2 rounded-full border border-gold-400/50 px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-gold-200 transition-colors duration-300 hover:border-gold-300 hover:bg-gold-500/15"
          >
            <MapPin className="h-3.5 w-3.5" />
            Explore {city.name}
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </article>
  ));

  if (reducedMotion) {
    return (
      <section
        id="story-section"
        className="bg-ink-950 py-20 text-bone-100"
        aria-label="Neighbourhoods"
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-8">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.28em] text-gold-400">
            Where We Build Trust
          </p>
          <h2 className="max-w-xl font-display text-3xl font-bold text-bone-50 sm:text-4xl">
            Eight cities, one standard of diligence
          </h2>
        </div>
        <div className="scrollbar-none mt-10 flex gap-6 overflow-x-auto px-4 pb-6 sm:px-8">
          {panels}
        </div>
      </section>
    );
  }

  return (
    <section id="story-section" ref={sectionRef} className="relative bg-ink-950 text-bone-100">
      <div ref={panelRef} className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden py-16">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-8">
          <div className="flex flex-col gap-4 pb-10 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.28em] text-gold-400">
                Where We Build Trust
              </p>
              <h2 className="max-w-xl font-display text-3xl font-bold leading-tight text-bone-50 sm:text-4xl lg:text-5xl">
                Eight cities, one standard of diligence
              </h2>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-bone-400">
              From Mumbai’s sea-facing towers to Goa’s Portuguese-era villas — scroll sideways through
              the micro-markets we actively cover.
            </p>
          </div>
        </div>

        <div ref={viewportRef} className="relative w-full overflow-hidden">
          <div ref={trackRef} className="flex h-[62vh] gap-6 px-4 will-change-transform sm:px-8">
            {panels}
          </div>
        </div>
      </div>
    </section>
  );
};
