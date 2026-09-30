import React from 'react';
import { Star } from 'lucide-react';
import { TESTIMONIALS } from '../data/site';

export const TestimonialsSection: React.FC = () => {
  return (
    <section id="testimonials-section" className="py-20 bg-stone-50 border-b border-stone-200 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-[11px] font-bold tracking-[0.2em] text-amber-700 uppercase mb-1.5">
              WHAT OUR CLIENTS SAY
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-950 font-serif-luxury tracking-tight">
              Trusted by Thousands
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-sm">
            Real outcomes from buyers, investors and owners across India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TESTIMONIALS.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl p-6 sm:p-7 border border-stone-200 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow relative group"
            >
              <div>
                <div className="flex items-center gap-1 mb-4 text-amber-500">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal italic mb-6">
                  {item.quote}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                <div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900">
                    {item.author}
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    {item.role}
                  </div>
                </div>

                <img
                  src={item.avatar}
                  alt={item.author}
                  className="w-11 h-11 rounded-full object-cover border-2 border-stone-100 shadow-xs"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
