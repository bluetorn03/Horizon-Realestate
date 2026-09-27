import React from 'react';
import { BadgeCheck, ScrollText, IndianRupee, Users } from 'lucide-react';
import { BRAND } from '../lib/locations';

const FEATURES = [
  {
    id: 'trust-badge-rera',
    icon: BadgeCheck,
    title: 'RERA Verified',
    description: 'Every project is checked against its state RERA registration before it is listed.',
  },
  {
    id: 'trust-badge-title',
    icon: ScrollText,
    title: 'Clear Title & Due Diligence',
    description: 'Encumbrance certificates, Khata extracts and 7/12 records verified by our legal desk.',
  },
  {
    id: 'trust-badge-pricing',
    icon: IndianRupee,
    title: 'Transparent ₹ Pricing',
    description: 'Carpet, built-up and super built-up areas disclosed — never an inflated sq ft figure.',
  },
  {
    id: 'trust-badge-advisors',
    icon: Users,
    title: 'Dedicated Private Advisors',
    description: 'One advisor from shortlist to registration, with NRI desk support across time zones.',
  },
];

export const TrustBadges: React.FC = () => {
  return (
    <section className="border-b border-bone-200 bg-white px-4 py-12 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8"
          data-reveal-stagger
        >
          {FEATURES.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                id={item.id}
                data-reveal-item
                className="group flex items-start gap-4 rounded-xl p-4 transition-colors duration-300 hover:bg-bone-100/70"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-ink-900 text-bone-50 shadow-lux-sm transition-all duration-500 group-hover:scale-105 group-hover:bg-gold-500 group-hover:text-ink-950">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-sm font-bold tracking-tight text-ink-900">{item.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-bone-500">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-8 text-center text-[11px] uppercase tracking-[0.22em] text-bone-500">
          {BRAND.legalName} · {BRAND.rera} · CIN {BRAND.cin}
        </p>
      </div>
    </section>
  );
};
