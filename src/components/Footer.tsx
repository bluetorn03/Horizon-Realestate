import React, { useState } from 'react';
import { 
  Building2, 
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

interface FooterProps {
  onScrollToSection: (sectionId: string) => void;
  onSelectCategory: (category: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onScrollToSection,
  onSelectCategory,
}) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubscribed(true);
    setNewsletterEmail('');
    setTimeout(() => setSubscribed(false), 5000);
  };

  const handleCategory = (cat: string) => {
    onSelectCategory(cat);
    onScrollToSection('properties-section');
  };

  return (
    <footer className="bg-[#070d1d] text-slate-400 text-xs border-t border-slate-800/80">
      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* 1. Brand column matching reference */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
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
                  FIND YOUR NEW HORIZON
                </span>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed font-light">
              Your trusted partner in finding exceptional properties.
            </p>

            {/* Social Icons matching reference */}
            <div className="flex items-center gap-3 pt-2">
              <a 
                href="#social" 
                className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-amber-400 hover:border-amber-500/50 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href="#social" 
                className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-amber-400 hover:border-amber-500/50 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="#social" 
                className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-amber-400 hover:border-amber-500/50 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a 
                href="#social" 
                className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-amber-400 hover:border-amber-500/50 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* 2. Quick Links matching reference */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4 font-sans">
              QUICK LINKS
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button 
                  onClick={() => onScrollToSection('hero-section')} 
                  className="hover:text-amber-400 transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onScrollToSection('about-section')} 
                  className="hover:text-amber-400 transition-colors"
                >
                  About Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onScrollToSection('properties-section')} 
                  className="hover:text-amber-400 transition-colors"
                >
                  Properties
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onScrollToSection('services-section')} 
                  className="hover:text-amber-400 transition-colors"
                >
                  Services
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onScrollToSection('testimonials-section')} 
                  className="hover:text-amber-400 transition-colors"
                >
                  Blog & Insights
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onScrollToSection('contact-section')} 
                  className="hover:text-amber-400 transition-colors"
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* 3. Property Types matching reference */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4 font-sans">
              PROPERTY TYPES
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button onClick={() => handleCategory('Apartment')} className="hover:text-amber-400 transition-colors">
                  Apartments
                </button>
              </li>
              <li>
                <button onClick={() => handleCategory('Villa')} className="hover:text-amber-400 transition-colors">
                  Villas
                </button>
              </li>
              <li>
                <button onClick={() => handleCategory('House')} className="hover:text-amber-400 transition-colors">
                  Houses
                </button>
              </li>
              <li>
                <button onClick={() => handleCategory('Commercial')} className="hover:text-amber-400 transition-colors">
                  Offices
                </button>
              </li>
              <li>
                <button onClick={() => handleCategory('Commercial')} className="hover:text-amber-400 transition-colors">
                  Commercial
                </button>
              </li>
              <li>
                <button onClick={() => handleCategory('Plot')} className="hover:text-amber-400 transition-colors">
                  Land / Plots
                </button>
              </li>
            </ul>
          </div>

          {/* 4. Contact Us matching reference */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4 font-sans">
              CONTACT US
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed">123 Skyline Avenue, New York, NY 10001</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <a href="tel:+12125557890" className="hover:text-amber-400 transition-colors">
                  +1 (212) 555-7890
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <a href="mailto:info@horizonestates.com" className="hover:text-amber-400 transition-colors">
                  info@horizonestates.com
                </a>
              </div>
            </div>
          </div>

          {/* 5. Newsletter matching reference */}
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

      {/* Bottom Bar matching reference */}
      <div className="border-t border-slate-800/80 py-6 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            © 2026 Horizon Estates. All Rights Reserved.
          </div>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <span>|</span>
            <a href="#terms" className="hover:text-slate-300 transition-colors">Terms & Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
