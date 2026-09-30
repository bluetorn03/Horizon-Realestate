import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Award, BadgePercent, Compass, type LucideIcon } from 'lucide-react';
import { PageHero } from '../components/layout/PageHero';
import { StatsCounter } from '../components/StatsCounter';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { SITE, VALUES, MILESTONES } from '../data/site';

const VALUE_ICONS: Record<string, LucideIcon> = { ShieldCheck, Award, BadgePercent, Compass };

export const AboutPage: React.FC = () => {
  return (
    <>
      <PageHero
        crumb="About Us"
        eyebrow="ABOUT HORIZON ESTATES"
        title="Building Trust, Delivering Value"
        description="A RERA-registered advisory firm helping families and investors buy, sell and manage exceptional property across India since 2014."
        image="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=2000&q=85"
      />

      {/* Story */}
      <section className="py-20 sm:py-24 bg-white px-4 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80"
              alt="Horizon Estates advisory team"
              className="w-full h-[380px] sm:h-[460px] object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />
          </div>

          <div>
            <div className="text-[11px] font-bold tracking-[0.2em] text-amber-700 uppercase mb-2">
              OUR STORY
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-950 font-serif-luxury tracking-tight leading-tight mb-6">
              A decade of getting the details right
            </h2>
            <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
              <p>
                Horizon Estates was founded in {SITE.founded} with a simple conviction: buying property in India
                should feel as considered as the homes themselves. We began as a small advisory desk in Lower
                Parel, working with a handful of families in South Mumbai.
              </p>
              <p>
                A decade later, we advise clients across eight cities from offices in Mumbai, Bengaluru,
                Gurugram and Dubai. Our approach has not changed — every listing is verified before it is
                shown, every cost is disclosed before it is incurred, and a single senior advisor stays with
                you from the first conversation to registration.
              </p>
              <p>
                We are a {SITE.rera} registered firm, and our legal and escrow team reviews title,
                encumbrance and RERA documentation on every transaction.
              </p>
            </div>

            <div className="mt-8">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-[#0b1329] hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-md shadow-md transition-all transform hover:-translate-y-0.5"
              >
                <span>SPEAK TO AN ADVISOR</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-stone-50 border-y border-stone-200 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="text-[11px] font-bold tracking-[0.2em] text-amber-700 uppercase mb-2">
              WHAT WE STAND FOR
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-950 font-serif-luxury tracking-tight">
              Our Values
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((value) => {
              const Icon = VALUE_ICONS[value.icon] ?? ShieldCheck;
              return (
                <div
                  key={value.title}
                  className="bg-white border border-stone-200 rounded-xl p-6 hover:shadow-xl transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-lg bg-[#0b1329] text-white flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2.5">{value.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{value.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <StatsCounter />

      {/* Milestones */}
      <section className="py-20 bg-white px-4 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="text-[11px] font-bold tracking-[0.2em] text-amber-700 uppercase mb-2">
              OUR JOURNEY
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-950 font-serif-luxury tracking-tight">
              Milestones
            </h2>
          </div>

          <ol className="relative border-l border-stone-200 ml-3 space-y-10">
            {MILESTONES.map((m) => (
              <li key={m.year} className="pl-8 relative">
                <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-amber-500 ring-4 ring-amber-500/20" />
                <div className="text-xs font-bold tracking-widest text-amber-700 uppercase">{m.year}</div>
                <h3 className="text-base font-bold text-slate-900 mt-1">{m.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-1 max-w-2xl">{m.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <TestimonialsSection />

      {/* CTA */}
      <section className="py-16 bg-[#0b1329] px-4 sm:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif-luxury">
            Ready to find your new horizon?
          </h2>
          <p className="text-sm text-slate-300 mt-3 max-w-xl mx-auto">
            Tell us what you are looking for and a senior advisor will shortlist verified options within 24 hours.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/properties"
              className="inline-flex items-center gap-2 bg-[#d8a853] hover:bg-[#c9973e] text-slate-950 font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-md shadow-lg"
            >
              <span>BROWSE PROPERTIES</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-transparent hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-md border border-white/40"
            >
              <span>CONTACT US</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};
