import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Clock, ArrowRight } from 'lucide-react';
import { PageHero } from '../components/layout/PageHero';
import { INSIGHTS } from '../data/site';

export const InsightsPage: React.FC = () => {
  const [featured, ...rest] = INSIGHTS;

  return (
    <>
      <PageHero
        crumb="Insights"
        eyebrow="BLOG & INSIGHTS"
        title="Market Intelligence for Informed Decisions"
        description="Research, regulation and micro-market analysis from our advisory desk — written for buyers, sellers and investors in Indian real estate."
        image="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=85"
      />

      <section className="py-20 bg-white px-4 sm:px-8 border-b border-stone-200">
        <div className="max-w-7xl mx-auto">
          {/* Featured article */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-stone-50/70 border border-stone-200/80 rounded-2xl overflow-hidden mb-14">
            <div className="h-72 lg:h-full overflow-hidden">
              <img
                src={featured.image}
                alt={featured.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="p-6 sm:p-10">
              <span className="text-[11px] font-bold tracking-[0.2em] text-amber-700 uppercase">
                {featured.category}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 font-serif-luxury tracking-tight mt-3 mb-4">
                {featured.title}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-5">{featured.excerpt}</p>
              <div className="flex items-center gap-4 text-[11px] text-slate-500 mb-6">
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="w-3.5 h-3.5 text-amber-600" />
                  {featured.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  {featured.readTime}
                </span>
              </div>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-900 hover:text-amber-700 uppercase tracking-wider"
              >
                <span>Request the full report</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Article grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rest.map((post) => (
              <article
                key={post.slug}
                className="bg-white border border-stone-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col"
              >
                <div className="h-48 overflow-hidden bg-stone-100">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <span className="text-[10px] font-bold tracking-[0.2em] text-amber-700 uppercase">
                    {post.category}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-2.5 mb-3 leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed flex-grow">{post.excerpt}</p>
                  <div className="flex items-center gap-4 text-[11px] text-slate-500 mt-5 pt-4 border-t border-stone-100">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="w-3.5 h-3.5 text-amber-600" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      {post.readTime}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#0b1329] px-4 sm:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif-luxury">
            Get our quarterly market note
          </h2>
          <p className="text-sm text-slate-300 mt-3 max-w-xl mx-auto">
            Subscribe from the footer, or talk to an advisor for a tailored view of your target micro-market.
          </p>
          <div className="mt-7">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-[#d8a853] hover:bg-[#c9973e] text-slate-950 font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-md shadow-lg"
            >
              <span>TALK TO AN ADVISOR</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};
