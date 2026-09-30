import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, ShieldCheck, ArrowRight } from 'lucide-react';
import { PageHero } from '../components/layout/PageHero';
import { AGENTS } from '../data/site';

export const AgentsPage: React.FC = () => {
  return (
    <>
      <PageHero
        crumb="Our Advisors"
        eyebrow="MEET THE TEAM"
        title="Advisors Who Know the Micro-Market"
        description="A RERA-registered team of residential, commercial and legal specialists — one dedicated advisor guides you from first call to registration."
        image="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=2000&q=85"
      />

      <section className="py-20 bg-white px-4 sm:px-8 border-b border-stone-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {AGENTS.map((agent) => (
              <div
                key={agent.name}
                className="bg-stone-50/70 border border-stone-200/80 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group"
              >
                <div className="relative h-64 overflow-hidden bg-stone-200">
                  <img
                    src={agent.photo}
                    alt={agent.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-base font-bold text-white">{agent.name}</h3>
                    <p className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">
                      {agent.role}
                    </p>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-semibold uppercase tracking-wider">Focus</span>
                    <span className="text-slate-800 font-bold text-right">{agent.focus}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-semibold uppercase tracking-wider">Experience</span>
                    <span className="text-slate-800 font-bold">{agent.experience}</span>
                  </div>
                  <div className="flex items-start gap-2 pt-1 text-[11px] text-slate-500">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>{agent.rera}</span>
                  </div>

                  <div className="pt-3 border-t border-stone-200 space-y-2 text-xs">
                    <a href={`tel:${agent.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 text-slate-700 hover:text-amber-700">
                      <Phone className="w-3.5 h-3.5 text-amber-600" />
                      <span>{agent.phone}</span>
                    </a>
                    <a href={`mailto:${agent.email}`} className="flex items-center gap-2 text-slate-700 hover:text-amber-700">
                      <Mail className="w-3.5 h-3.5 text-amber-600" />
                      <span>{agent.email}</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#0b1329] px-4 sm:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif-luxury">
            Not sure who to speak to?
          </h2>
          <p className="text-sm text-slate-300 mt-3 max-w-xl mx-auto">
            Share your requirement and we will connect you with the specialist best suited to your brief.
          </p>
          <div className="mt-7">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-[#d8a853] hover:bg-[#c9973e] text-slate-950 font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-md shadow-lg"
            >
              <span>GET MATCHED WITH AN ADVISOR</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};
