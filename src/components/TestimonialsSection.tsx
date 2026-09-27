import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { SplitText } from './SplitText';
import { avatarImage } from '../lib/images';

const TESTIMONIALS = [
  {
    id: 'test-1',
    rating: 5,
    quote:
      'They handed me the carpet-area plan and the RERA filing before I even asked. I bought a 3 BHK in Kharghar without a single surprise at registration.',
    author: 'Aditya Raman',
    role: 'Buyer · Navi Mumbai',
    avatar: 'photo-1507003211169-0a1dd7228f2d',
  },
  {
    id: 'test-2',
    rating: 5,
    quote:
      'As an NRI I needed everything verified remotely. Horizon ran the title search, coordinated the home loan and had the agreement executed on my POA.',
    author: 'Priya Raghavan',
    role: 'NRI Buyer · Bengaluru',
    avatar: 'photo-1544005313-94ddf0286df2',
  },
  {
    id: 'test-3',
    rating: 5,
    quote:
      'The ₹ per sq ft comparison across Powai, Kharghar and Ulwe was what decided it for me. Honest numbers, no sales pressure.',
    author: 'Karthik Nambiar',
    role: 'Investor · Thane',
    avatar: 'photo-1560250097-0b93528c311a',
  },
  {
    id: 'test-4',
    rating: 5,
    quote:
      'I listed my Pune bungalow and had three qualified viewings in the first week. Their photography and floor plans did most of the selling.',
    author: 'Sunita Deshmukh',
    role: 'Seller · Pune',
    avatar: 'photo-1573496359142-b8d87734a5a2',
  },
  {
    id: 'test-5',
    rating: 5,
    quote:
      'We took a 4,800 sq ft office floor in Hinjawadi. The lease was clean, the CAM charges were disclosed, and handover happened on the date promised.',
    author: 'Rohit Bansal',
    role: 'Commercial Tenant · Pune',
    avatar: 'photo-1500648767791-00dcc994a43e',
  },
  {
    id: 'test-6',
    rating: 5,
    quote:
      'The Goa villa needed real restoration expertise. Their team understood the laterite structure and the coastal permissions.',
    author: 'Elena Fernandes',
    role: 'Buyer · Goa',
    avatar: 'photo-1580489944761-15a19d654956',
  },
];

export const TestimonialsSection: React.FC = () => {
  const [offset, setOffset] = useState(0);

  const visible = [
    TESTIMONIALS[offset % TESTIMONIALS.length],
    TESTIMONIALS[(offset + 1) % TESTIMONIALS.length],
    TESTIMONIALS[(offset + 2) % TESTIMONIALS.length],
  ];

  const handlePrev = () =>
    setOffset((current) => (current - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const handleNext = () => setOffset((current) => (current + 1) % TESTIMONIALS.length);

  return (
    <section
      id="testimonials-section"
      className="border-b border-bone-200 bg-white px-4 py-20 sm:px-8 sm:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <div
          className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end"
          data-reveal="up"
        >
          <div>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.28em] text-gold-600">
              Client Stories
            </p>
            <SplitText
              as="h2"
              text="Trusted across eight cities"
              className="font-display text-3xl font-bold leading-tight tracking-tight text-ink-950 sm:text-4xl"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="testimonial-prev-btn"
              onClick={handlePrev}
              aria-label="Previous testimonials"
              className="grid h-10 w-10 place-items-center rounded-full border border-bone-300 bg-white text-ink-700 shadow-xs transition-colors hover:border-gold-400 hover:text-gold-700"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              id="testimonial-next-btn"
              onClick={handleNext}
              aria-label="Next testimonials"
              className="grid h-10 w-10 place-items-center rounded-full border border-bone-300 bg-white text-ink-700 shadow-xs transition-colors hover:border-gold-400 hover:text-gold-700"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3" data-reveal-stagger>
          {visible.map((item) => (
            <figure
              key={item.id}
              data-reveal-item
              className="flex flex-col justify-between rounded-xl border border-bone-200 bg-bone-50/60 p-6 shadow-lux-sm transition-shadow duration-500 hover:shadow-lux-md sm:p-7"
            >
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-gold-500">
                    {Array.from({ length: item.rating }).map((_, index) => (
                      <Star key={index} className="h-4 w-4 fill-gold-400 text-gold-400" />
                    ))}
                  </div>
                  <Quote className="h-6 w-6 text-bone-300" />
                </div>
                <blockquote className="text-sm italic leading-relaxed text-ink-700">
                  “{item.quote}”
                </blockquote>
              </div>

              <figcaption className="mt-6 flex items-center justify-between border-t border-bone-200 pt-4">
                <div>
                  <div className="text-sm font-bold text-ink-900">{item.author}</div>
                  <div className="text-[11px] font-medium text-bone-500">{item.role}</div>
                </div>
                <img
                  src={avatarImage(item.avatar, 160)}
                  alt=""
                  width={44}
                  height={44}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="h-11 w-11 rounded-full border-2 border-bone-200 object-cover"
                />
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};
