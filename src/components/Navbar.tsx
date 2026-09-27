import React, { useEffect, useRef, useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Heart,
  Plus,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Calendar,
  Home,
  ShieldCheck,
  Layers,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { MagneticButton } from './MagneticButton';
import { BRAND } from '../lib/locations';
import { scrollToSection, scrollToTop } from '../lib/scroll';

interface NavbarProps {
  onOpenAuth: () => void;
  onOpenAddProperty: () => void;
  onOpenDashboard: (tab?: 'listings' | 'viewings' | 'inquiries' | 'favorites') => void;
  onSelectCategory: (category: string) => void;
  onSelectLocation: (city: string) => void;
  onScrollToSection: (sectionId: string) => void;
  favoritesCount: number;
  onOpenFavorites: () => void;
}

const CATEGORY_LINKS = [
  { label: 'All Residences', value: 'All', hint: 'View all' },
  { label: 'Apartments & Flats', value: 'Apartment', hint: 'Rent / Sale' },
  { label: 'Villas', value: 'Villa', hint: 'Independent' },
  { label: 'Houses & Bungalows', value: 'House', hint: 'Plots included' },
  { label: 'Residential Plots', value: 'Plot', hint: 'Land' },
  { label: 'Commercial Offices', value: 'Commercial', hint: 'Grade A' },
];

const CITY_LINKS = ['Mumbai', 'Navi Mumbai', 'Thane', 'Pune', 'Bengaluru', 'Hyderabad', 'Delhi NCR', 'Goa'];

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuth,
  onOpenAddProperty,
  onOpenDashboard,
  onSelectCategory,
  onSelectLocation,
  onScrollToSection,
  favoritesCount,
  onOpenFavorites,
}) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [propertiesDropdownOpen, setPropertiesDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setMobileMenuOpen(false);
      setUserDropdownOpen(false);
      setPropertiesDropdownOpen(false);
    };
    const onClickOutside = (event: MouseEvent) => {
      if (!navRef.current?.contains(event.target as Node)) {
        setUserDropdownOpen(false);
        setPropertiesDropdownOpen(false);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onClickOutside);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onClickOutside);
    };
  }, []);

  const handleNavClick = (sectionId: string) => {
    onScrollToSection(sectionId);
    setMobileMenuOpen(false);
  };

  const handleCategoryClick = (category: string) => {
    onSelectCategory(category);
    setPropertiesDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const handleCityClick = (city: string) => {
    onSelectLocation(city);
    setPropertiesDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const navLinkClass =
    'text-[11px] font-bold uppercase tracking-[0.16em] text-ink-700 transition-colors duration-300 hover:text-gold-600';

  return (
    <header ref={navRef} className="relative z-40">
      {/* Utility bar */}
      <div className="border-b border-bone-100/10 bg-ink-950 px-4 py-2 text-[11px] text-bone-300 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 md:flex-row">
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-gold-400" />
              <span className="hidden sm:inline">{BRAND.addressLine1}, {BRAND.addressLine2}</span>
              <span className="sm:hidden">Mumbai · India</span>
            </span>
            <a
              href={`tel:${BRAND.phonePrimary.replace(/\s/g, '')}`}
              className="hidden items-center gap-1.5 transition-colors hover:text-gold-300 sm:flex"
            >
              <Phone className="h-3.5 w-3.5 shrink-0 text-gold-400" />
              {BRAND.phonePrimary}
            </a>
            <a
              href={`mailto:${BRAND.emailPrimary}`}
              className="hidden items-center gap-1.5 transition-colors hover:text-gold-300 md:flex"
            >
              <Mail className="h-3.5 w-3.5 shrink-0 text-gold-400" />
              {BRAND.emailPrimary}
            </a>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden text-bone-500 sm:inline">RERA {BRAND.rera}</span>
            <div className="flex items-center gap-3">
              {[Facebook, Instagram, Linkedin, Twitter].map((Icon, index) => (
                <a
                  key={index}
                  href="#social"
                  aria-label={['Facebook', 'Instagram', 'LinkedIn', 'Twitter'][index]}
                  className="text-bone-500 transition-colors hover:text-gold-300"
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div
        className={`sticky top-0 z-40 border-b transition-all duration-500 ${
          scrolled
            ? 'border-bone-300/60 bg-bone-50/90 shadow-lux-sm backdrop-blur-xl'
            : 'border-transparent bg-bone-50'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-8">
          {/* Brand */}
          <button
            type="button"
            onClick={() => {
              scrollToTop();
              setMobileMenuOpen(false);
            }}
            className="group flex items-center gap-3 text-left"
            aria-label="Horizon Estates — back to top"
          >
            <span className="flex h-9 w-9 items-end justify-center gap-[3px] pb-1" aria-hidden="true">
              <span className="w-[4px] rounded-t-[2px] bg-gold-600 transition-all duration-500 group-hover:h-6" style={{ height: 18 }} />
              <span className="w-[4px] rounded-t-[2px] bg-gold-400" style={{ height: 30 }} />
              <span className="w-[4px] rounded-t-[2px] bg-gold-700 transition-all duration-500 group-hover:h-5" style={{ height: 22 }} />
            </span>
            <span className="block">
              <span className="font-brand block text-lg font-bold leading-none tracking-[0.18em] text-ink-950 sm:text-xl">
                HORIZON
              </span>
              <span className="mt-1 block text-[9px] font-semibold uppercase leading-none tracking-[0.3em] text-bone-500">
                Estates · India
              </span>
            </span>
          </button>

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-7 lg:flex">
            <button type="button" onClick={() => handleNavClick('hero-section')} className={navLinkClass}>
              Home
            </button>
            <button type="button" onClick={() => handleNavClick('about-section')} className={navLinkClass}>
              About
            </button>

            <div className="relative">
              <button
                type="button"
                id="nav-properties-dropdown-btn"
                aria-expanded={propertiesDropdownOpen}
                aria-haspopup="true"
                onClick={() => setPropertiesDropdownOpen((open) => !open)}
                onMouseEnter={() => setPropertiesDropdownOpen(true)}
                className={`flex items-center gap-1.5 ${navLinkClass}`}
              >
                Residences
                <ChevronDown
                  className={`h-3.5 w-3.5 text-bone-400 transition-transform duration-300 ${
                    propertiesDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {propertiesDropdownOpen && (
                <div
                  onMouseLeave={() => setPropertiesDropdownOpen(false)}
                  className="absolute left-0 top-full z-50 mt-3 w-[30rem] overflow-hidden rounded-xl border border-bone-300/70 bg-white shadow-lux-lg"
                >
                  <div className="grid grid-cols-2 gap-6 p-5">
                    <div>
                      <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-bone-500">
                        By Property Type
                      </p>
                      <ul className="space-y-1">
                        {CATEGORY_LINKS.map((link) => (
                          <li key={link.value}>
                            <button
                              type="button"
                              onClick={() => handleCategoryClick(link.value)}
                              className="flex w-full items-center justify-between rounded-md px-2.5 py-2 text-left text-xs font-medium text-ink-800 transition-colors hover:bg-gold-50 hover:text-gold-700"
                            >
                              {link.label}
                              <span className="text-[10px] text-bone-500">{link.hint}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-bone-500">
                        By City
                      </p>
                      <ul className="space-y-1">
                        {CITY_LINKS.map((city) => (
                          <li key={city}>
                            <button
                              type="button"
                              onClick={() => handleCityClick(city)}
                              className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs font-medium text-ink-800 transition-colors hover:bg-gold-50 hover:text-gold-700"
                            >
                              <MapPin className="h-3.5 w-3.5 text-gold-500" />
                              {city}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-bone-200 bg-bone-100/60 px-5 py-3">
                    <span className="text-[11px] text-bone-500">
                      {BRAND.rera}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setPropertiesDropdownOpen(false);
                        scrollToSection('collection-marquee');
                      }}
                      className="text-[11px] font-bold uppercase tracking-[0.16em] text-gold-700 hover:text-gold-600"
                    >
                      Signature Collection →
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button type="button" onClick={() => handleNavClick('visualizer-section')} className={navLinkClass}>
              Visualiser
            </button>
            <button type="button" onClick={() => handleNavClick('services-section')} className={navLinkClass}>
              Services
            </button>
            <button type="button" onClick={() => handleNavClick('testimonials-section')} className={navLinkClass}>
              Clients
            </button>
            <button type="button" onClick={() => handleNavClick('contact-section')} className={navLinkClass}>
              Contact
            </button>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              id="header-favorites-btn"
              onClick={onOpenFavorites}
              className="relative grid h-9 w-9 place-items-center rounded-full text-ink-600 transition-colors hover:bg-rose-50 hover:text-rose-600"
              title="Shortlisted residences"
              aria-label={`Shortlisted residences (${favoritesCount})`}
            >
              <Heart className="h-[18px] w-[18px]" />
              {favoritesCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-rose-600 px-1 text-[10px] font-bold text-white">
                  {favoritesCount}
                </span>
              )}
            </button>

            <MagneticButton
              id="header-add-property-btn"
              variant="outline"
              size="sm"
              onClick={onOpenAddProperty}
              className="hidden sm:inline-flex"
            >
              <Plus className="h-3.5 w-3.5" />
              List Property
            </MagneticButton>

            {user ? (
              <div className="relative">
                <button
                  type="button"
                  id="user-profile-menu-btn"
                  aria-expanded={userDropdownOpen}
                  onClick={() => setUserDropdownOpen((open) => !open)}
                  className="flex items-center gap-2 rounded-full border border-bone-300 bg-white py-1.5 pl-2 pr-3 shadow-xs transition-colors hover:border-gold-400"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt=""
                      width={28}
                      height={28}
                      referrerPolicy="no-referrer"
                      className="h-7 w-7 rounded-full border border-gold-400/50 object-cover"
                    />
                  ) : (
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-gold-500 text-xs font-bold text-ink-950">
                      {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                    </span>
                  )}
                  <span className="hidden max-w-[92px] truncate text-xs font-medium text-ink-800 md:inline">
                    {user.displayName || user.email?.split('@')[0]}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-bone-400" />
                </button>

                {userDropdownOpen && (
                  <div
                    onMouseLeave={() => setUserDropdownOpen(false)}
                    className="absolute right-0 top-full z-50 mt-3 w-60 overflow-hidden rounded-xl border border-bone-300/70 bg-white shadow-lux-lg"
                  >
                    <div className="border-b border-bone-200 px-4 py-3">
                      <p className="truncate text-xs font-bold text-ink-900">
                        {user.displayName || 'Member'}
                      </p>
                      <p className="truncate text-[11px] text-bone-500">{user.email}</p>
                    </div>
                    <div className="py-1.5">
                      {[
                        { id: 'menu-my-listings-btn', label: 'My Listed Properties', icon: Home, tab: 'listings' as const },
                        { id: 'menu-my-viewings-btn', label: 'My Booked Viewings', icon: Calendar, tab: 'viewings' as const },
                        { id: 'menu-inquiries-btn', label: 'Inquiries Received', icon: Layers, tab: 'inquiries' as const },
                        { id: 'menu-saved-favorites-btn', label: 'Shortlisted Homes', icon: Heart, tab: 'favorites' as const },
                      ].map((item) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            id={item.id}
                            onClick={() => {
                              onOpenDashboard(item.tab);
                              setUserDropdownOpen(false);
                            }}
                            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-xs text-ink-700 transition-colors hover:bg-gold-50 hover:text-gold-800"
                          >
                            <Icon className="h-4 w-4 text-gold-600" />
                            {item.label}
                          </button>
                        );
                      })}
                    </div>
                    <div className="border-t border-bone-200 py-1.5">
                      <button
                        type="button"
                        id="menu-logout-btn"
                        onClick={async () => {
                          setUserDropdownOpen(false);
                          await logout();
                        }}
                        className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <MagneticButton id="header-get-in-touch-btn" variant="ink" size="sm" onClick={onOpenAuth}>
                Sign In
              </MagneticButton>
            )}

            <button
              type="button"
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="grid h-9 w-9 place-items-center rounded-md text-ink-800 transition-colors hover:bg-bone-200 lg:hidden"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {mobileMenuOpen && (
          <div className="max-h-[calc(100svh-4.5rem)] overflow-y-auto border-t border-bone-300 bg-bone-50 px-4 pb-8 pt-4 lg:hidden">
            <nav className="flex flex-col">
              {[
                { label: 'Home', id: 'hero-section' },
                { label: 'About Us', id: 'about-section' },
                { label: 'Signature Collection', id: 'collection-marquee' },
                { label: 'Architecture Visualiser', id: 'visualizer-section' },
                { label: 'Services', id: 'services-section' },
                { label: 'Client Stories', id: 'testimonials-section' },
                { label: 'Contact', id: 'contact-section' },
              ].map((link) => (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => handleNavClick(link.id)}
                  className="border-b border-bone-200 py-3 text-left text-sm font-semibold text-ink-900 transition-colors hover:text-gold-700"
                >
                  {link.label}
                </button>
              ))}
            </nav>

            <p className="mb-2 mt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-bone-500">
              Browse by city
            </p>
            <div className="flex flex-wrap gap-2">
              {CITY_LINKS.map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => handleCityClick(city)}
                  className="rounded-full border border-bone-300 bg-white px-3 py-1.5 text-[11px] font-semibold text-ink-800 transition-colors hover:border-gold-400 hover:text-gold-700"
                >
                  {city}
                </button>
              ))}
            </div>

            <p className="mb-2 mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-bone-500">
              Browse by type
            </p>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORY_LINKS.map((link) => (
                <button
                  key={link.value}
                  type="button"
                  onClick={() => handleCategoryClick(link.value)}
                  className="rounded-lg bg-bone-100 px-3 py-2.5 text-left text-xs font-semibold text-ink-800 transition-colors hover:bg-gold-50 hover:text-gold-800"
                >
                  {link.label}
                </button>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-2.5">
              <MagneticButton
                variant="gold"
                size="md"
                onClick={() => {
                  onOpenAddProperty();
                  setMobileMenuOpen(false);
                }}
                className="w-full"
              >
                <Plus className="h-4 w-4" />
                List Your Property
              </MagneticButton>
              {!user && (
                <MagneticButton
                  variant="ink"
                  size="md"
                  onClick={() => {
                    onOpenAuth();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full"
                >
                  <ShieldCheck className="h-4 w-4" />
                  Sign In / Sign Up
                </MagneticButton>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
