import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Clock } from 'lucide-react';
import { MagneticButton } from './MagneticButton';
import { SplitText } from './SplitText';
import { BRAND } from '../lib/locations';

const INTERESTS = [
  'Buying a residence (₹50 Lakh – ₹1 Cr)',
  'Buying a residence (₹1 Cr – ₹5 Cr)',
  'Buying a residence (₹5 Cr+)',
  'Renting a residence',
  'Listing my property for sale',
  'Leasing commercial office space',
  'NRI purchase advisory',
];

export const ContactSection: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interest: INTERESTS[0],
    message: '',
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!formData.name || !formData.email) return;
    setSubmitted(true);
  };

  const details = [
    {
      icon: MapPin,
      label: 'Head Office',
      value: `${BRAND.addressLine1}, ${BRAND.addressLine2}`,
    },
    { icon: Phone, label: 'Direct Line', value: `${BRAND.phonePrimary} · ${BRAND.phoneSecondary}` },
    { icon: Mail, label: 'Email', value: `${BRAND.emailPrimary} · ${BRAND.emailSecondary}` },
    { icon: Clock, label: 'Consultation Hours', value: BRAND.hours },
  ];

  return (
    <section id="contact-section" className="border-b border-bone-200 bg-bone-100/60 px-4 py-20 sm:px-8 sm:py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Info column */}
        <div data-reveal="up">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.28em] text-gold-600">
            Private Advisory
          </p>
          <SplitText
            as="h2"
            text="Speak to a senior advisor"
            className="font-display text-3xl font-bold leading-tight tracking-tight text-ink-950 sm:text-4xl lg:text-5xl"
          />
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-bone-500">
            Whether you are acquiring a sea-facing residence in Worli, listing a heritage bungalow in
            Pune, or structuring an NRI purchase, our advisory desk will respond within two working
            hours.
          </p>

          <div className="mt-9 space-y-6" data-reveal-stagger>
            {details.map((detail) => {
              const Icon = detail.icon;
              return (
                <div key={detail.label} data-reveal-item className="flex items-start gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-bone-300 bg-white text-gold-600 shadow-lux-sm">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink-900">
                      {detail.label}
                    </h4>
                    <p className="mt-1 text-xs leading-relaxed text-bone-500">{detail.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form column */}
        <div className="rounded-2xl border border-bone-300/70 bg-white p-6 shadow-lux-lg sm:p-8">
          {submitted ? (
            <div className="py-12 text-center">
              <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-8 w-8" />
              </span>
              <h3 className="font-display text-xl font-bold text-ink-900">Inquiry received</h3>
              <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-bone-500">
                Thank you for writing to Horizon Estates. A senior private advisor will contact you
                within two working hours on the number you have shared.
              </p>
              <div className="mt-6">
                <MagneticButton variant="ink" size="sm" onClick={() => setSubmitted(false)}>
                  Send another inquiry
                </MagneticButton>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="mb-2 font-display text-lg font-bold text-ink-900">
                Request a private consultation
              </h3>

              <div>
                <label
                  htmlFor="contact-name"
                  className="mb-1 block text-[10px] font-bold uppercase tracking-[0.16em] text-ink-700"
                >
                  Full Name *
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                  placeholder="e.g. Ananya Sharma"
                  className="w-full rounded-lg border border-bone-300 bg-bone-50 px-3.5 py-2.5 text-xs font-medium text-ink-900 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="contact-email"
                    className="mb-1 block text-[10px] font-bold uppercase tracking-[0.16em] text-ink-700"
                  >
                    Email *
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                    placeholder="you@example.in"
                    className="w-full rounded-lg border border-bone-300 bg-bone-50 px-3.5 py-2.5 text-xs font-medium text-ink-900 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
                  />
                </div>
                <div>
                  <label
                    htmlFor="contact-phone"
                    className="mb-1 block text-[10px] font-bold uppercase tracking-[0.16em] text-ink-700"
                  >
                    Phone
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(event) => setFormData({ ...formData, phone: event.target.value })}
                    placeholder="+91 98200 00000"
                    className="w-full rounded-lg border border-bone-300 bg-bone-50 px-3.5 py-2.5 text-xs font-medium text-ink-900 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-interest"
                  className="mb-1 block text-[10px] font-bold uppercase tracking-[0.16em] text-ink-700"
                >
                  Area of Interest
                </label>
                <select
                  id="contact-interest"
                  value={formData.interest}
                  onChange={(event) => setFormData({ ...formData, interest: event.target.value })}
                  className="w-full rounded-lg border border-bone-300 bg-bone-50 px-3.5 py-2.5 text-xs font-medium text-ink-900 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
                >
                  {INTERESTS.map((interest) => (
                    <option key={interest} value={interest}>
                      {interest}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="mb-1 block text-[10px] font-bold uppercase tracking-[0.16em] text-ink-700"
                >
                  Requirement
                </label>
                <textarea
                  id="contact-message"
                  rows={4}
                  value={formData.message}
                  onChange={(event) => setFormData({ ...formData, message: event.target.value })}
                  placeholder="City, BHK configuration, budget range and preferred possession timeline..."
                  className="w-full resize-none rounded-lg border border-bone-300 bg-bone-50 px-3.5 py-2.5 text-xs font-medium text-ink-900 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
                />
              </div>

              <MagneticButton type="submit" variant="ink" size="md" className="w-full">
                <Send className="h-3.5 w-3.5 text-gold-400" />
                Send Advisory Request
              </MagneticButton>

              <p className="text-center text-[10px] leading-relaxed text-bone-500">
                By submitting you agree to be contacted by a Horizon Estates advisor. We never share
                your details with third-party developers.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
