import React from 'react';
import { Home, FileText, Key, Camera, Calculator, ShieldCheck } from 'lucide-react';

interface ServicesSectionProps {
  onSelectCategory: (category: string) => void;
  onOpenAddProperty: () => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onSelectCategory,
  onOpenAddProperty,
}) => {
  const services = [
    {
      icon: Home,
      title: 'Property Sales & Acquisition',
      desc: 'Exclusive access to premier luxury houses, beachfront villas, and entitled land parcels with discreet negotiation.',
      action: 'Browse Listings',
      onClick: () => onSelectCategory('House'),
    },
    {
      icon: Key,
      title: 'Luxury Rentals & Leasing',
      desc: 'Long-term corporate leases and furnished high-rise penthouses in central metropolitan hubs.',
      action: 'View Rentals',
      onClick: () => onSelectCategory('Apartment'),
    },
    {
      icon: Calculator,
      title: 'Instant Property Valuation',
      desc: 'Accurate algorithmic and comparable market analyses powered by historical sales data and neighborhood appreciation.',
      action: 'List for Sale',
      onClick: onOpenAddProperty,
    },
    {
      icon: Camera,
      title: '3D Virtual Walkthroughs',
      desc: 'Immersive 4K Matterport capture allowing international buyers to explore properties room by room.',
      action: 'Learn More',
      onClick: () => {},
    },
    {
      icon: FileText,
      title: 'Legal & Escrow Advisory',
      desc: 'Streamlined title review, contract drafting, and certified escrow settlement for safe transfers.',
      action: 'Learn More',
      onClick: () => {},
    },
    {
      icon: ShieldCheck,
      title: 'Asset Management',
      desc: 'Full-service tenant management, maintenance coordination, and revenue optimization for institutional portfolios.',
      action: 'Learn More',
      onClick: () => {},
    },
  ];

  return (
    <section id="services-section" className="py-20 bg-white border-b border-stone-200 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-[11px] font-bold tracking-[0.2em] text-amber-700 uppercase mb-2">
            OUR SERVICES
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-950 font-serif-luxury tracking-tight">
            Comprehensive Real Estate Solutions
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
            From premier estate acquisition to personalized property marketing, Horizon Estates delivers unmatched expertise at every stage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="bg-stone-50/70 border border-stone-200/80 rounded-xl p-6 sm:p-8 hover:bg-white hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-lg bg-[#0b1329] group-hover:bg-amber-600 text-white flex items-center justify-center transition-colors mb-5 shadow-xs">
                    <Icon className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2.5">
                    {service.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {service.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-200/60 flex items-center justify-between">
                  <button
                    onClick={service.onClick}
                    className="text-xs font-bold text-slate-900 group-hover:text-amber-700 transition-colors uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                  >
                    <span>{service.action}</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
