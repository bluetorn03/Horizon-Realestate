import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Send, 
  Check, 
  Facebook, 
  Instagram, 
  Linkedin, 
  Twitter 
} from 'lucide-react';
import { SITE } from '../data/site';

const QUICK_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about' },
  { label: 'Properties', to: '/properties' },
  { label: 'Services', to: '/services' },
  { label: 'Our Advisors', to: '/agents' },
  { label: 'Blog & Insights', to: '/insights' },
  { label: 'Contact Us', to: '/contact' },
];

const PROPERTY_TYPES = [
  { label: 'Apartments', to: '/properties?category=Apartment' },
  { label: 'Villas', to: '/properties?category=Villa' },
  { label: 'Houses', to: '/properties?category=House' },
  { label: 'Offices', to: '/properties?category=Commercial' },
  { label: 'Commercial', to: '/properties?category=Commercial' },
  { label: 'Land / Plots', to: '/properties?category=Plot' },
];

export const Footer: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubscribed(true);
    setNewsletterEmail('');
    setTimeout(() => setSubscribed(false), 5000);
  };

  return (
    <footer className="bg-[#070d1d] text-slate-400 text-xs border-t border-slate-800/80">
      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* 1. Brand column */}
          <div className="lg:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex items-end gap-0.5 h-8 w-8 justify-center pb-0.5">
                <div className="w-1.5 h-5 bg-amber-600 rounded-t-[1px]"></div>
                <div className="w-1.5 h-8 bg-amber-500 rounded-t-[1px]"></div>
                <div className="w-1.5 h-6 bg-amber-700 rounded-t-[1px]"></div>
              </div>
              <div>
                <span className="font-brand font-bold text-lg tracking-wider text-white block leading-tight">
                  HORIZON
                </span>
                <span className="text-[9px] tracking-[0.25em] text-slate-400 font-semibold uppercase block leading-none">
                  — ESTATES —
                </span>
                <span className="text-[7.5px] tracking-wider text-amber-500 font-medium block">
                  {SITE.tagline.toUpperCase()}
                </span>
              </div>
            </Link>

            <p className="text-slate-400 text-xs leading-relaxed font-light">
              Your trusted partner in finding exceptional properties across India.
            </p>

            <div className="flex items-center gap-3 pt-2">
              {[
                { Icon: Facebook, label: 'Facebook' },
                { Icon: Instagram, label: 'Instagram' },
                { Icon: Linkedin, label: 'LinkedIn' },
                { Icon: Twitter, label: 'Twitter' },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href={`#${label.toLowerCase()}`}
                  className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-amber-400 hover:border-amber-500/50 transition-colors"
                  aria-label={label}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* 2. Quick Links */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4 font-sans">
              QUICK LINKS
            </h4>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="hover:text-amber-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Property Types */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4 font-sans">
              PROPERTY TYPES
            </h4>
            <ul className="space-y-2.5">
              {PROPERTY_TYPES.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="hover:text-amber-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Contact Us */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4 font-sans">
              CONTACT US
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{SITE.headquarters}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <a href={`tel:${SITE.phone.replace(/\s/g, '')}`} className="hover:text-amber-400 transition-colors">
                  {SITE.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <a href={`mailto:${SITE.email}`} className="hover:text-amber-400 transition-colors">
                  {SITE.email}
                </a>
              </div>
              <div className="text-[11px] text-slate-500 pt-1">{SITE.rera}</div>
            </div>
          </div>

          {/* 5. Newsletter */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4 font-sans">
              NEWSLETTER
            </h4>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Subscribe to get the latest updates and exclusive offers.
            </p>

            <form onSubmit={handleSubscribe} className="relative flex items-center">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-3.5 pr-12 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="absolute right-1 top-1 bottom-1 px-3 bg-[#d8a853] hover:bg-[#c9973e] text-slate-950 rounded-md flex items-center justify-center transition-colors cursor-pointer"
              >
                {subscribed ? <Check className="w-4 h-4 text-slate-950" /> : <Send className="w-3.5 h-3.5 fill-slate-950" />}
              </button>
            </form>

            {subscribed && (
              <p className="text-[11px] text-emerald-400 mt-2">
                Thank you for subscribing to Horizon Estates!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800/80 py-6 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            © 2026 Horizon Estates. All Rights Reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link to="/contact" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <span>|</span>
            <Link to="/contact" className="hover:text-slate-300 transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
