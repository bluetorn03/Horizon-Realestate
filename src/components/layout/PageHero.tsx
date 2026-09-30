import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface PageHeroProps {
  eyebrow: string;
  title: string;
  description?: string;
  crumb: string;
  image?: string;
}

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=85';

export const PageHero: React.FC<PageHeroProps> = ({
  eyebrow,
  title,
  description,
  crumb,
  image = DEFAULT_IMAGE,
}) => {
  return (
    <section className="relative w-full bg-slate-950 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover object-center brightness-[0.55] contrast-[1.05]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-950/50" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-20">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-5">
          <Link to="/" className="hover:text-amber-400 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-amber-400">{crumb}</span>
        </nav>

        <div className="inline-flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-amber-500 ring-4 ring-amber-500/20"></span>
          <span className="w-6 h-[1.5px] bg-amber-500/60"></span>
          <span className="text-[11px] sm:text-xs tracking-[0.2em] font-bold text-amber-400 uppercase">
            {eyebrow}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight font-serif-luxury max-w-3xl">
          {title}
        </h1>

        {description && (
          <p className="mt-4 text-slate-200 text-sm sm:text-base leading-relaxed max-w-2xl font-light">
            {description}
          </p>
        )}
      </div>
    </section>
  );
};
