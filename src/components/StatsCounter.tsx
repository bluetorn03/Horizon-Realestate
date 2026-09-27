import React from 'react';
import { Building2, Key, Users, MapPinned } from 'lucide-react';

const STATS = [
  {
    id: 'stat-properties-sale',
    icon: Building2,
    value: '1,850+',
    label: 'Residences for sale',
  },
  {
    id: 'stat-properties-rent',
    icon: Key,
    value: '640+',
    label: 'Monthly rentals live',
  },
  {
    id: 'stat-happy-clients',
    icon: Users,
    value: '3,400+',
    label: 'Families advised',
  },
  {
    id: 'stat-years-exp',
    icon: MapPinned,
    value: '8 Cities',
    label: 'Across India',
  },
];

export const StatsCounter: React.FC = () => {
  return (
    <section className="wash-ink border-y border-bone-100/10 px-4 py-14 text-bone-100 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-12">
          {STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.id}
                id={stat.id}
                className="group flex items-center justify-center gap-4 md:justify-start"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-bone-100/20 bg-white/5 transition-colors duration-500 group-hover:border-gold-400/60">
                  <Icon className="h-5 w-5 text-bone-300 transition-colors duration-500 group-hover:text-gold-300" />
                </span>
                <div>
                  <div className="font-display text-2xl font-bold tracking-tight text-bone-50 sm:text-3xl">
                    {stat.value}
                  </div>
                  <div className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.14em] text-bone-400">
                    {stat.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
