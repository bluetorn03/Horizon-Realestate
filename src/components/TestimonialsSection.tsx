import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    {
      id: 'test-1',
      rating: 5,
      quote: '"Horizon Estates made finding my dream home a seamless experience. Highly professional and trustworthy team!"',
      author: 'Sarah Johnson',
      role: 'Home Buyer',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80',
    },
    {
      id: 'test-2',
      rating: 5,
      quote: '"Their market knowledge and attention to detail helped us get the best investment property. Excellent service!"',
      author: 'Michael Thompson',
      role: 'Real Estate Investor',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    },
    {
      id: 'test-3',
      rating: 5,
      quote: '"From start to finish, the team was incredible. They truly care about their clients and deliver results."',
      author: 'Emily Davis',
      role: 'Property Owner',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    },
    {
      id: 'test-4',
      rating: 5,
      quote: '"Listing my plot through Horizon was the best decision. Closed in under 3 weeks with top-tier private escrow."',
      author: 'David Harrison',
      role: 'Land Developer',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    },
  ];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="testimonials-section" className="py-20 bg-stone-50 border-b border-stone-200 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header matching reference */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-[11px] font-bold tracking-[0.2em] text-amber-700 uppercase mb-1.5">
              WHAT OUR CLIENTS SAY
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-950 font-serif-luxury tracking-tight">
              Trusted by Thousands
            </h2>
          </div>

          {/* Nav buttons < > */}
          <div className="flex items-center gap-2">
            <button
              id="testimonial-prev-btn"
              onClick={handlePrev}
              className="w-9 h-9 rounded-full border border-stone-300 bg-white hover:bg-stone-100 text-slate-700 flex items-center justify-center transition-colors shadow-xs"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              id="testimonial-next-btn"
              onClick={handleNext}
              className="w-9 h-9 rounded-full border border-stone-300 bg-white hover:bg-stone-100 text-slate-700 flex items-center justify-center transition-colors shadow-xs"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Testimonials Grid matching reference */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl p-6 sm:p-7 border border-stone-200 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow relative group"
            >
              <div>
                {/* 5 Stars */}
                <div className="flex items-center gap-1 mb-4 text-amber-500">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Quote Text */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal italic mb-6">
                  {item.quote}
                </p>
              </div>

              {/* Author & Avatar */}
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
