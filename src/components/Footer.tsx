import React, { useState } from 'react';
import { MapPin, Phone, Mail, Send, Check, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { BRAND, INDIAN_CITIES } from '../lib/locations';
import { scrollToSection } from '../lib/scroll';

interface FooterProps {
  onScrollToSection: (sectionId: string) => void;
  onSelectCategory: (category: string) => void;
  onSelectLocation: (city: string) => void;
}

const QUICK_LINKS = [
  { label: 'Home', id: 'hero-section' },
  { label: 'About Us', id: 'about-section' },
  { label: 'Signature Collection', id: 'collection-marquee' },
  { label: 'Architecture Visualiser', id: 'visualizer-section' },
  { label: 'Services', id: 'services-section' },
  { label: 'Client Stories', id: 'testimonials-section' },
  { label: 'Contact', id: 'contact-section' },
];

const PROPERTY_TYPES = [
  { label: 'Apartments & Flats', value: 'Apartment' },
  { label: 'Villas', value: 'Villa' },
  { label: 'Houses & Bungalows', value: 'House' },
  { label: 'Residential Plots', value: 'Plot' },
  { label: 'Commercial Offices', value: 'Commercial' },
];

export const Footer: React.FC<FooterProps> = ({
  onScrollToSection,
  onSelectCategory,
  onSelectLocation,
}) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (event: React.FormEvent) => {
    event.preventDefault();
    if (!newsletterEmail) return;
    setSubscribed(true);
    setNewsletterEmail('');
    window.setTimeout(() => setSubscribed(false), 6000);
  };

  const handleCategory = (category: string) => {
    onSelectCategory(category);
    onScrollToSection('properties-section');
  };

  const handleCity = (city: string) => {
    onSelectLocation(city);
    onScrollToSection('properties-section');
  };

  return (
    <footer className="wash-ink border-t border-bone-100/10 text-bone-400">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-8">
        <div
          className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5 lg:gap-8"
          data-reveal-stagger
        >
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-end justify-center gap-[3px] pb-1" aria-hidden="true">
                <span className="w-[4px] rounded-t-[2px] bg-gold-600" style={{ height: 18 }} />
                <span className="w-[4px] rounded-t-[2px] bg-gold-400" style={{ height: 30 }} />
                <span className="w-[4px] rounded-t-[2px] bg-gold-700" style={{ height: 22 }} />
              </span>
              <span>
                <span className="font-brand block text-lg font-bold leading-none tracking-[0.18em] text-bone-50">
                  HORIZON
                </span>
                <span className="mt-1 block text-[9px] font-semibold uppercase leading-none tracking-[0.3em] text-bone-500">
                  Estates · India
                </span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-bone-400">
              A private property advisory representing vetted, RERA-registered residences across
              India's eight most active markets.
            </p>
            <div className="flex items-center gap-3 pt-1">
              {[
                { Icon: Facebook, label: 'Facebook' },
                { Icon: Instagram, label: 'Instagram' },
                { Icon: Linkedin, label: 'LinkedIn' },
                { Icon: Twitter, label: 'Twitter' },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#social"
                  aria-label={label}
                  className="grid h-8 w-8 place-items-center rounded-full border border-bone-100/15 bg-white/5 text-bone-400 transition-colors hover:border-gold-400/50 hover:text-gold-300"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-bone-50">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.id}>
                  <button
                    type="button"
                    onClick={() => onScrollToSection(link.id)}
                    className="text-xs transition-colors hover:text-gold-300"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Property types */}
          <div>
            <h4 className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-bone-50">
              Property Types
            </h4>
            <ul className="space-y-2.5">
              {PROPERTY_TYPES.map((type) => (
                <li key={type.value}>
                  <button
                    type="button"
                    onClick={() => handleCategory(type.value)}
                    className="text-xs transition-colors hover:text-gold-300"
                  >
                    {type.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Cities */}
          <div>
            <h4 className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-bone-50">
              Cities We Cover
            </h4>
            <ul className="space-y-2.5">
              {INDIAN_CITIES.map((city) => (
                <li key={city.name}>
                  <button
                    type="button"
                    onClick={() => handleCity(city.name)}
                    className="text-xs transition-colors hover:text-gold-300"
                  >
                    {city.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + newsletter */}
          <div>
            <h4 className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-bone-50">
              Contact
            </h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
                <span className="leading-relaxed">
                  {BRAND.addressLine1}, {BRAND.addressLine2}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-gold-500" />
                <a
                  href={`tel:${BRAND.phonePrimary.replace(/\s/g, '')}`}
                  className="transition-colors hover:text-gold-300"
                >
                  {BRAND.phonePrimary}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-gold-500" />
                <a href={`mailto:${BRAND.emailPrimary}`} className="transition-colors hover:text-gold-300">
                  {BRAND.emailPrimary}
                </a>
              </li>
            </ul>

            <h4 className="mb-3 mt-8 text-[11px] font-bold uppercase tracking-[0.18em] text-bone-50">
              New Launch Alerts
            </h4>
            <p className="mb-3 text-xs leading-relaxed text-bone-400">
              A short monthly note on new launches, circle-rate revisions and RERA filings.
            </p>
            <form onSubmit={handleSubscribe} className="relative flex items-center">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(event) => setNewsletterEmail(event.target.value)}
                placeholder="your@email.in"
                aria-label="Email address for new launch alerts"
                className="w-full rounded-lg border border-bone-100/15 bg-white/5 py-2.5 pl-3.5 pr-12 text-xs text-bone-50 placeholder-bone-500 focus:border-gold-400/60 focus:outline-none focus:ring-1 focus:ring-gold-500"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="absolute right-1 top-1 bottom-1 grid place-items-center rounded-md bg-gold-500 px-3 text-ink-950 transition-colors hover:bg-gold-400"
              >
                {subscribed ? <Check className="h-4 w-4" /> : <Send className="h-3.5 w-3.5" />}
              </button>
            </form>
            {subscribed && (
              <p className="mt-2 text-[11px] text-emerald-400">
                Subscribed — thank you for following Horizon Estates.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-bone-100/10 px-4 py-6 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-[11px] text-bone-500 sm:flex-row">
          <p>© {new Date().getFullYear()} {BRAND.legalName}. All rights reserved.</p>
          <p className="text-center sm:text-right">
            {BRAND.rera} · CIN {BRAND.cin} · GSTIN {BRAND.gst}
          </p>
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => scrollToSection('contact-section')}
              className="transition-colors hover:text-bone-300"
            >
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('contact-section')}
              className="transition-colors hover:text-bone-300"
            >
              Terms & Conditions
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
