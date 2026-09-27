import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { Compass, Layers, Sun, Move3d } from 'lucide-react';
import { usePrefersReducedMotion } from '../hooks/useReducedMotion';
import { useInView } from '../hooks/useInView';
import { useWebGLSupport, usePrefersLightweight3D } from '../hooks/useWebGLSupport';
import { ScrollTrigger } from '../lib/gsap';
import { visualizerSceneState } from '../lib/sceneState';
import { SplitText } from './SplitText';

/**
 * The building visualiser is a heavy WebGL scene: it is code-split and only
 * mounted once the section is close to the viewport.
 */
const BuildingVisualizer = React.lazy(() => import('./three/BuildingVisualizer'));

const STEPS = [
  {
    id: 'orientation',
    icon: Compass,
    eyebrow: '01 — Site & Orientation',
    title: 'Plotted for light and cross-ventilation',
    copy: 'Every residence we represent is studied for its plot orientation, marginal open space and wind path before a single line is drawn.',
  },
  {
    id: 'planning',
    icon: Layers,
    eyebrow: '02 — Spatial Planning',
    title: 'Carpet area engineered, not advertised',
    copy: 'Floor plates separate on scroll to reveal how carpet, built-up and super built-up areas are distributed across the residence.',
  },
  {
    id: 'terrace',
    icon: Sun,
    eyebrow: '03 — Terrace & Amenity',
    title: 'Outdoor rooms that carry the interior',
    copy: 'Pergolas, infinity edges and landscaped decks are planned with the same rigour as the interiors they extend.',
  },
] as const;

/**
 * Pinned architectural storytelling section.
 *
 * The 3D residence is scroll-scrubbed: the camera dollies in, the building
 * rotates and the floor plates lift apart as the section progresses, while the
 * editorial copy cross-fades between three beats.
 */
export const ArchitectureVisualizer: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const reducedMotion = usePrefersReducedMotion();
  const webgl = useWebGLSupport();
  const lightweight = usePrefersLightweight3D();
  const { ref: viewRef, inView } = useInView<HTMLDivElement>({ rootMargin: '300px 0px' });

  const showScene = inView && webgl && !reducedMotion;

  useEffect(() => {
    const section = sectionRef.current;
    const panel = panelRef.current;
    if (!section || !panel) return;

    visualizerSceneState.scrollProgress = 0;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: '+=220%',
      pin: panel,
      pinSpacing: true,
      anticipatePin: 1,
      scrub: true,
      onUpdate: (self) => {
        visualizerSceneState.scrollProgress = self.progress;
        const next = Math.min(STEPS.length - 1, Math.floor(self.progress * STEPS.length));
        setActiveStep((current) => (current === next ? current : next));
      },
      onLeaveBack: () => {
        visualizerSceneState.scrollProgress = 0;
        setActiveStep(0);
      },
    });

    return () => {
      trigger.kill();
      visualizerSceneState.scrollProgress = 0;
    };
  }, []);

  return (
    <section
      id="visualizer-section"
      ref={sectionRef}
      className="relative bg-ink-950 text-bone-100"
      aria-label="Architectural visualisation"
    >
      <div ref={panelRef} className="relative min-h-[100svh] overflow-hidden">
        {/* 3D layer */}
        <div
          ref={viewRef}
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(80% 70% at 50% 12%, rgba(176,141,63,0.14), transparent 62%), linear-gradient(180deg, #0b1220 0%, #0e1626 60%, #0b1220 100%)',
          }}
          aria-hidden="true"
        >
          {showScene ? (
            <Suspense fallback={null}>
              <BuildingVisualizer reducedMotion={reducedMotion} lightweight={lightweight} className="!absolute inset-0" />
            </Suspense>
          ) : null}
        </div>

        {/* Vignette for legibility */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              'linear-gradient(180deg, rgba(6,11,22,0.85) 0%, rgba(6,11,22,0.15) 32%, rgba(6,11,22,0.2) 62%, rgba(6,11,22,0.92) 100%)',
          }}
        />

        <div className="relative mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col justify-between px-4 py-14 sm:px-8 sm:py-20">
          {/* Header */}
          <div className="max-w-2xl">
            <p className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.28em] text-gold-400">
              <Move3d className="h-4 w-4" />
              Interactive Architecture
            </p>
            <SplitText
              as="h2"
              text="See the residence before you visit it"
              className="font-display text-3xl font-bold leading-[1.1] text-bone-50 sm:text-4xl lg:text-5xl"
            />
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-bone-400">
              A real-time architectural study, scrubbed to your scroll. Drag to orbit the model on
              desktop.
            </p>
          </div>

          {/* Steps */}
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === activeStep;
              return (
                <div
                  key={step.id}
                  data-active={isActive ? 'true' : 'false'}
                  className={`rounded-xl border p-5 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isActive
                      ? 'border-gold-400/45 bg-white/[0.06] opacity-100 shadow-lux-lg backdrop-blur-sm'
                      : 'border-bone-100/10 bg-white/[0.02] opacity-45'
                  }`}
                >
                  <div className="mb-3 flex items-center gap-2.5">
                    <span
                      className={`grid h-8 w-8 place-items-center rounded-full border transition-colors duration-500 ${
                        isActive
                          ? 'border-gold-400/60 bg-gold-500/15 text-gold-300'
                          : 'border-bone-100/20 text-bone-400'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-bone-400">
                      {step.eyebrow}
                    </span>
                  </div>
                  <h3 className="font-display text-base font-bold text-bone-50">{step.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-bone-400">{step.copy}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fallback note when WebGL is unavailable */}
        {!webgl ? (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full border border-bone-100/15 bg-ink-950/80 px-4 py-2 text-[11px] text-bone-400 backdrop-blur-sm">
            3D visualisation is unavailable on this device — photography below carries the detail.
          </div>
        ) : null}
      </div>
    </section>
  );
};
