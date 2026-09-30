import React from 'react';
import { MapPin, BadgePercent, Users, ShieldCheck, type LucideIcon } from 'lucide-react';
import { TRUST_BADGES } from '../data/site';

const ICONS: Record<string, LucideIcon> = {
  MapPin,
  BadgePercent,
  Users,
  ShieldCheck,
};

export const TrustBadges: React.FC = () => {
  return (
    <section className="bg-white border-b border-stone-200 py-10 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {TRUST_BADGES.map((item) => {
            const Icon = ICONS[item.icon] ?? MapPin;
            return (
              <div
                key={item.id}
                id={item.id}
                className="flex items-start gap-4 p-4 rounded-xl hover:bg-stone-50 transition-colors group"
              >
                <div className="w-12 h-12 rounded-full bg-[#0b1329] text-white flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-amber-600 transition-all shadow-md">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
