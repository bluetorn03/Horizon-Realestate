import React, { useState } from 'react';
import { Play, ArrowRight, CheckCircle2, Compass, Ruler, ShieldCheck } from 'lucide-react';
import { MagneticButton } from './MagneticButton';
import { SplitText } from './SplitText';
import { unsplashUrl } from '../lib/images';
import { scrollToSection } from '../lib/scroll';

interface AboutSectionProps {
  onLearnMore: () => void;
}

const PILLARS = [
  {
    icon: Ruler,
    title: 'Carpet-area honesty',
    copy: 'We publish carpet, built-up and super built-up areas separately, and quote ₹ per sq ft on carpet area — the number that actually matters to your loan.',
  },
  {
    icon: ShieldCheck,
    title: 'RERA & title diligence',
    copy: 'State RERA registration, commencement certificate, encumbrance certificate and the 7/12 or Khata extract are checked before a residence is ever shortlisted to you.',
  },
  {
    icon: Compass,
    title: 'One advisor, end to end',
    copy: 'The same private advisor handles site visits, negotiation, home-loan coordination and registration — with a dedicated NRI desk for overseas buyers.',
  },
];

export const AboutSection: React.FC<AboutSectionProps> = ({ onLearnMore }) => {
  const [showShowcase, setShowShowcase] = useState(false);

  return (
    <section id="about-section" className="overflow-hidden bg-white px-4 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Media column */}
        <div className="relative overflow-hidden rounded-2xl shadow-lux-lg" data-zoom-scope>
          <img
            data-zoom="in"
            src={unsplashUrl('photo-1706241137081-4b5e0f038d88', { width: 1200, quality: 78 })}
            alt="Bengaluru skyline at dusk"
            width={1200}
            height={900}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            className="h-[380px] w-full object-cover will-change-transform sm:h-[460px] lg:h-[540px]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/65 via-ink-950/10 to-transparent" />

          <div className="absolute inset-0 flex items-center justify-center">
            <button
              type="button"
              id="about-play-video-btn"
              onClick={() => setShowShowcase(true)}
              aria-label="Watch the Horizon showcase"
              className="grid h-16 w-16 place-items-center rounded-full bg-gold-500/90 text-ink-950 shadow-lux-lg ring-8 ring-gold-500/25 backdrop-blur-sm transition-all duration-500 hover:scale-110 hover:bg-gold-400 sm:h-20 sm:w-20"
            >
              <Play className="ml-1 h-7 w-7 fill-ink-950" />
            </button>
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-4 rounded-xl border border-bone-200/60 bg-bone-50/95 p-4 shadow-lux-md backdrop-blur-md">
            <div>
              <div className="text-xs font-bold text-ink-900">Virtual & on-site walkthroughs</div>
              <div className="mt-0.5 text-[11px] text-bone-500">
                360° tours for NRI and outstation buyers
              </div>
            </div>
            <span className="flex items-center gap-1.5 text-xs font-bold text-gold-600">
              <Compass className="h-4 w-4" />
              360°
            </span>
          </div>
        </div>

        {/* Narrative column */}
        <div>
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.28em] text-gold-600">
            About Horizon Estates
          </p>
          <SplitText
            as="h2"
            text="Built on diligence, not on brochures"
            className="font-display text-3xl font-bold leading-[1.08] tracking-tight text-ink-950 sm:text-4xl lg:text-5xl"
          />
          <p className="mt-5 text-sm leading-relaxed text-bone-500 sm:text-base">
            Horizon Estates is a private property advisory working across India's eight most active
            residential markets. We represent a deliberately small, thoroughly vetted portfolio —
            sea-facing residences in Worli, node-township homes in Navi Mumbai, heritage bungalows in
            Pune, and lakefront villas in Goa — and we publish the paperwork that backs every one of
            them.
          </p>

          <div className="mt-8 space-y-5" data-reveal-stagger>
            {PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div key={pillar.title} data-reveal-item className="flex items-start gap-4">
                  <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-bone-300 bg-bone-100 text-gold-600">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-ink-900">{pillar.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-bone-500">{pillar.copy}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-9">
            <MagneticButton id="about-learn-more-btn" variant="ink" size="lg" onClick={onLearnMore}>
              Speak to an Advisor
              <ArrowRight className="h-4 w-4 text-gold-400" />
            </MagneticButton>
          </div>
        </div>
      </div>

      {/* Showcase overlay */}
      {showShowcase && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/85 p-4 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label="Horizon Estates showcase"
          onClick={() => setShowShowcase(false)}
        >
          <div
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-bone-100/15 bg-ink-900 p-6 shadow-lux-lg"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowShowcase(false)}
              className="absolute right-4 top-4 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-bold text-bone-200 transition-colors hover:bg-white/20"
            >
              Close
            </button>

            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-gold-400">
              The Horizon Standard
            </p>
            <h3 className="mt-2 font-display text-xl font-bold text-bone-50">
              Eight cities. One standard of diligence.
            </h3>

            <div className="relative mt-5 aspect-video overflow-hidden rounded-xl border border-bone-100/10">
              <img
                src={unsplashUrl('photo-1652820330085-82a0c2b88d78', { width: 1200, quality: 76 })}
                alt="Konkan coastline, Goa"
                width={1200}
                height={675}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover opacity-80"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-ink-950/55 p-6 text-center">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-gold-500 text-ink-950">
                  <Play className="ml-0.5 h-5 w-5 fill-ink-950" />
                </span>
                <p className="max-w-sm text-xs leading-relaxed text-bone-200">
                  A private advisor will walk you through carpet-area plans, RERA filings and
                  comparable ₹ per sq ft data for your shortlist — on a call, or on site.
                </p>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <MagneticButton
                variant="gold"
                size="sm"
                onClick={() => {
                  setShowShowcase(false);
                  scrollToSection('contact-section');
                }}
              >
                Request the walkthrough
              </MagneticButton>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
