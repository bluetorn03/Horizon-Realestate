import React from 'react';
import {
  Home,
  FileText,
  Key,
  Camera,
  Calculator,
  ShieldCheck,
  Globe2,
  Wrench,
} from 'lucide-react';
import { SplitText } from './SplitText';

interface ServicesSectionProps {
  onSelectCategory: (category: string) => void;
  onOpenAddProperty: () => void;
}

const SERVICES = [
  {
    icon: Home,
    title: 'Buying & Acquisition',
    copy: 'Shortlists built around carpet area, floor rise, marginal open space and the ₹ per sq ft you are actually paying.',
    action: 'Browse residences',
    onClick: 'Apartment',
  },
  {
    icon: Key,
    title: 'Rentals & Leasing',
    copy: 'Furnished and semi-furnished rentals with deposit, maintenance and lock-in terms disclosed up front.',
    action: 'View rentals',
    onClick: 'Apartment',
  },
  {
    icon: Calculator,
    title: 'Valuation & Pricing',
    copy: 'Comparable-transaction analysis using circle rates, ready-reckoner values and actual registered consideration.',
    action: 'List for sale',
    onClick: 'add',
  },
  {
    icon: FileText,
    title: 'Legal & Title Diligence',
    copy: 'Encumbrance certificates, 7/12 extracts, Khata verification, society NOC and agreement drafting.',
    action: 'Learn more',
    onClick: 'contact',
  },
  {
    icon: ShieldCheck,
    title: 'Home Loan Desk',
    copy: 'Pre-approved offers from SBI, HDFC, ICICI and Axis with balance-transfer and top-up planning.',
    action: 'Learn more',
    onClick: 'contact',
  },
  {
    icon: Camera,
    title: '3D & Virtual Walkthroughs',
    copy: 'Architectural studies and 360° capture so NRI buyers can review a residence from anywhere.',
    action: 'See the visualiser',
    onClick: 'visualizer',
  },
  {
    icon: Globe2,
    title: 'NRI Advisory',
    copy: 'FEMA-compliant routing, power-of-attorney execution and repatriation guidance for overseas Indians.',
    action: 'Learn more',
    onClick: 'contact',
  },
  {
    icon: Wrench,
    title: 'Property Management',
    copy: 'Tenant placement, rent collection, society coordination and annual maintenance for absentee owners.',
    action: 'Learn more',
    onClick: 'contact',
  },
];

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onSelectCategory,
  onOpenAddProperty,
}) => {
  const handleClick = (target: string) => {
    if (target === 'add') {
      onOpenAddProperty();
      return;
    }
    if (target === 'contact') {
      document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (target === 'visualizer') {
      document.getElementById('visualizer-section')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    onSelectCategory(target);
  };

  return (
    <section id="services-section" className="border-b border-bone-200 bg-bone-100/60 px-4 py-20 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.28em] text-gold-600">
            Our Services
          </p>
          <SplitText
            as="h2"
            text="Everything a purchase in India needs"
            className="font-display text-3xl font-bold leading-tight tracking-tight text-ink-950 sm:text-4xl lg:text-5xl"
          />
          <p className="mt-4 text-sm leading-relaxed text-bone-500">
            From shortlist to registration, and from tenancy to annual maintenance — one accountable
            desk for the entire ownership lifecycle.
          </p>
        </div>

        <div
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
          data-reveal-stagger
        >
          {SERVICES.map((service) => {
            const Icon = service.icon;
            return (
              <article
                key={service.title}
                data-reveal-item
                className="group flex flex-col justify-between rounded-xl border border-bone-300/70 bg-white p-6 transition-all duration-500 hover:-translate-y-1 hover:border-gold-400/50 hover:shadow-lux-lg"
              >
                <div>
                  <span className="mb-5 grid h-12 w-12 place-items-center rounded-lg bg-ink-900 text-bone-50 shadow-lux-sm transition-colors duration-500 group-hover:bg-gold-500 group-hover:text-ink-950">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="text-base font-bold text-ink-900">{service.title}</h3>
                  <p className="mt-2.5 text-xs leading-relaxed text-bone-500">{service.copy}</p>
                </div>
                <div className="mt-6 border-t border-bone-200 pt-4">
                  <button
                    type="button"
                    onClick={() => handleClick(service.onClick)}
                    className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-ink-900 transition-colors duration-300 group-hover:text-gold-700"
                  >
                    {service.action}
                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
