import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Home,
  Key,
  Calculator,
  Camera,
  FileText,
  ShieldCheck,
  ArrowRight,
  ChevronDown,
  type LucideIcon,
} from 'lucide-react';
import { PageHero } from '../components/layout/PageHero';
import { SERVICES, SERVICE_PROCESS, FAQS } from '../data/site';

const SERVICE_ICONS: Record<string, LucideIcon> = { Home, Key, Calculator, Camera, FileText, ShieldCheck };

export const ServicesPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <>
      <PageHero
        crumb="Services"
        eyebrow="OUR SERVICES"
        title="Comprehensive Real Estate Solutions"
        description="From premier estate acquisition to title diligence, escrow and portfolio management — Horizon Estates delivers end-to-end advisory at every stage."
        image="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=85"
      />

      {/* Services grid */}
      <section className="py-20 bg-white px-4 sm:px-8 border-b border-stone-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES.map((service) => {
              const Icon = SERVICE_ICONS[service.icon] ?? Home;
              return (
                <div
                  key={service.title}
                  className="bg-stone-50/70 border border-stone-200/80 rounded-xl p-6 sm:p-8 hover:bg-white hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-lg bg-[#0b1329] group-hover:bg-amber-600 text-white flex items-center justify-center transition-colors mb-5 shadow-xs">
                    <Icon className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2.5">{service.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{service.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-stone-50 px-4 sm:px-8 border-b border-stone-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="text-[11px] font-bold tracking-[0.2em] text-amber-700 uppercase mb-2">
              HOW WE WORK
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-950 font-serif-luxury tracking-tight">
              A Five-Step Advisory Process
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
              Structured, transparent and documented — so you always know exactly where your transaction stands.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {SERVICE_PROCESS.map((step) => (
              <div key={step.step} className="bg-white border border-stone-200 rounded-xl p-6 relative">
                <span className="text-3xl font-bold text-amber-500/30 font-serif-luxury">{step.step}</span>
                <h3 className="text-sm font-bold text-slate-900 mt-2 mb-2">{step.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white px-4 sm:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-[11px] font-bold tracking-[0.2em] text-amber-700 uppercase mb-2">
              QUESTIONS
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-950 font-serif-luxury tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={faq.q} className="border border-stone-200 rounded-xl overflow-hidden bg-stone-50/60">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="text-sm font-bold text-slate-900">{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-amber-600 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-xs text-slate-600 leading-relaxed border-t border-stone-200 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#0b1329] px-4 sm:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif-luxury">
            Let&apos;s plan your next move
          </h2>
          <p className="text-sm text-slate-300 mt-3 max-w-xl mx-auto">
            Book a complimentary consultation and we will put together a tailored shortlist and cost sheet.
          </p>
          <div className="mt-7">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-[#d8a853] hover:bg-[#c9973e] text-slate-950 font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-md shadow-lg"
            >
              <span>REQUEST A CONSULTATION</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};
