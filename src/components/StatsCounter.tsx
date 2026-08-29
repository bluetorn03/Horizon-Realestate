import React from 'react';
import { Home, Key, Users, Award } from 'lucide-react';

export const StatsCounter: React.FC = () => {
  const stats = [
    {
      id: 'stat-properties-sale',
      icon: Home,
      value: '150+',
      label: 'Properties for Sale',
    },
    {
      id: 'stat-properties-rent',
      icon: Key,
      value: '250+',
      label: 'Properties for Rent',
    },
    {
      id: 'stat-happy-clients',
      icon: Users,
      value: '1200+',
      label: 'Happy Clients',
    },
    {
      id: 'stat-years-exp',
      icon: Award,
      value: '10+',
      label: 'Years of Experience',
    },
  ];

  return (
    <section className="bg-[#0b1329] text-white py-12 px-4 sm:px-8 border-y border-slate-800">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.id}
                id={stat.id}
                className="flex items-center gap-4 group justify-center md:justify-start"
              >
                {/* Thin outline icon in circle matching reference */}
                <div className="w-12 h-12 rounded-full border border-slate-700/80 bg-slate-900/50 flex items-center justify-center shrink-0 group-hover:border-amber-500/80 transition-colors">
                  <Icon className="w-6 h-6 text-slate-300 group-hover:text-amber-400 transition-colors stroke-[1.5]" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-serif-luxury">
                    {stat.value}
                  </div>
                  <div className="text-xs text-slate-400 font-medium mt-0.5 tracking-wide">
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
