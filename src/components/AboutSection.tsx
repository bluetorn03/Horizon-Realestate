import React, { useState } from 'react';
import { Play, ArrowRight, CheckCircle2, Award, Shield, Compass } from 'lucide-react';

interface AboutSectionProps {
  onLearnMore: () => void;
  onOpenVideoTour?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  onLearnMore,
  onOpenVideoTour,
}) => {
  const [showVideoModal, setShowVideoModal] = useState(false);

  return (
    <section id="about-section" className="py-20 sm:py-24 bg-white px-4 sm:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column: City Skyline Sunset Image with Golden Play Button */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
            <img
              src="https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=1200&q=80"
              alt="City Skyline Sunset - Horizon Estates Vision"
              className="w-full h-[380px] sm:h-[450px] object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              referrerPolicy="no-referrer"
            />
            {/* Warm twilight overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/20 to-transparent" />

            {/* Glowing Golden Play Button matching reference */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                id="about-play-video-btn"
                onClick={() => setShowVideoModal(true)}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-500/90 hover:bg-amber-500 text-slate-950 flex items-center justify-center shadow-2xl backdrop-blur-xs transition-all transform hover:scale-110 ring-8 ring-amber-500/30 group-hover:ring-amber-500/50"
                title="Watch Horizon Estates Story"
                aria-label="Play brand video"
              >
                <Play className="w-7 h-7 fill-slate-950 text-slate-950 ml-1" />
              </button>
            </div>

            {/* Bottom floating badge */}
            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-stone-200/60 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-900">Virtual & On-Site Experience</div>
                <div className="text-[11px] text-slate-500">Experience world-class real estate presentation</div>
              </div>
              <div className="flex items-center gap-1 text-amber-600 text-xs font-bold">
                <Compass className="w-4 h-4" />
                <span>360° Tours</span>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative Content matching reference */}
          <div className="flex flex-col justify-center">
            {/* Eyebrow badge */}
            <div className="text-[11px] font-bold tracking-[0.2em] text-amber-700 uppercase mb-2">
              ABOUT US
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-950 font-serif-luxury tracking-tight leading-tight mb-6">
              Building Trust, <br />
              <span className="text-amber-700 font-serif-luxury">Delivering Value</span>
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6 font-normal">
              Horizon Estates is a premier real estate firm dedicated to helping you find the perfect property. With years of experience and a passion for excellence, we make your real estate journey smooth, transparent, and exceptionally rewarding.
            </p>

            {/* Value bullets */}
            <div className="space-y-3 mb-8">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Curated Premium Portfolio</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Every villa, penthouse, and commercial plot is rigorously vetted for legal integrity and architectural caliber.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Frictionless Viewing & Booking</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Instant scheduling for private guided walkthroughs with dedicated licensed advisors.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Direct Owner Marketplace</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Seamless listing management allowing property owners to connect directly with pre-qualified buyers.</p>
                </div>
              </div>
            </div>

            {/* Action button matching reference */}
            <div>
              <button
                id="about-learn-more-btn"
                onClick={onLearnMore}
                className="inline-flex items-center gap-2 bg-[#0b1329] hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-md shadow-md transition-all transform hover:-translate-y-0.5"
              >
                <span>LEARN MORE ABOUT US</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal if clicked */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 text-white shadow-2xl relative">
            <button
              onClick={() => setShowVideoModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-xs font-bold bg-slate-800 px-3 py-1.5 rounded-full"
            >
              ✕ Close
            </button>

            <div className="mb-4">
              <span className="text-[10px] font-bold tracking-widest text-amber-400 uppercase">Horizon Vision</span>
              <h3 className="text-lg font-bold font-serif-luxury text-white mt-1">Excellence in Modern Real Estate</h3>
            </div>

            <div className="relative aspect-video rounded-xl overflow-hidden bg-black mb-4 flex items-center justify-center border border-slate-800">
              <img
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
                alt="Estate Preview"
                className="w-full h-full object-cover opacity-60"
                referrerPolicy="no-referrer"
              />
              <div className="absolute text-center p-6 bg-slate-950/70 rounded-xl max-w-md border border-slate-800">
                <div className="w-12 h-12 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center mx-auto mb-3">
                  <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
                </div>
                <h4 className="text-sm font-bold text-white">Horizon Estates Private Showcase</h4>
                <p className="text-xs text-slate-300 mt-1">
                  Discover our bespoke portfolio of luxury houses, skyline penthouses, and development plots across the nation.
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowVideoModal(false)}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold"
              >
                Continue Exploring
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
