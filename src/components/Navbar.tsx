import React, { useState } from 'react';
import { 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Heart, 
  Plus, 
  User as UserIcon, 
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
  Twitter
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onOpenAuth: () => void;
  onOpenAddProperty: () => void;
  onOpenDashboard: (tab?: 'listings' | 'viewings' | 'inquiries' | 'favorites') => void;
  onSelectCategory: (category: string) => void;
  onScrollToSection: (sectionId: string) => void;
  favoritesCount: number;
  onOpenFavorites: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuth,
  onOpenAddProperty,
  onOpenDashboard,
  onSelectCategory,
  onScrollToSection,
  favoritesCount,
  onOpenFavorites,
}) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [propertiesDropdownOpen, setPropertiesDropdownOpen] = useState(false);

  const handleNavClick = (sectionId: string) => {
    onScrollToSection(sectionId);
    setMobileMenuOpen(false);
  };

  const handleCategoryClick = (cat: string) => {
    onSelectCategory(cat);
    onScrollToSection('properties-section');
    setPropertiesDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="w-full relative z-40">
      {/* Top Luxury Bar matching reference */}
      <div className="bg-[#0b1329] text-slate-300 text-xs py-2 px-4 sm:px-8 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-6">
            <div className="flex items-center gap-1.5 hover:text-amber-400 transition-colors cursor-pointer">
              <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>123 Skyline Avenue, New York, NY 10001</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 hover:text-amber-400 transition-colors">
              <Phone className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <a href="tel:+12125557890">+1 (212) 555-7890</a>
            </div>
            <div className="hidden md:flex items-center gap-1.5 hover:text-amber-400 transition-colors">
              <Mail className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <a href="mailto:info@horizonestates.com">info@horizonestates.com</a>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-slate-400">Follow Us:</span>
            <div className="flex items-center gap-3">
              <a href="#social" className="text-slate-400 hover:text-amber-400 transition-colors" aria-label="Facebook">
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a href="#social" className="text-slate-400 hover:text-amber-400 transition-colors" aria-label="Instagram">
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a href="#social" className="text-slate-400 hover:text-amber-400 transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-3.5 h-3.5" />
              </a>
              <a href="#social" className="text-slate-400 hover:text-amber-400 transition-colors" aria-label="Twitter">
                <Twitter className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Luxury Header */}
      <div className="bg-white/95 backdrop-blur-md shadow-sm border-b border-stone-200 transition-all sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
          {/* Logo matching reference image: 3 stylized gold building lines + HORIZON ESTATES */}
          <button 
            id="brand-logo-btn"
            onClick={() => handleNavClick('hero-section')}
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            <div className="flex items-end gap-0.5 h-8 w-8 justify-center pb-0.5">
              <div className="w-1.5 h-5 bg-amber-600 rounded-t-[1px]"></div>
              <div className="w-1.5 h-8 bg-amber-500 rounded-t-[1px]"></div>
              <div className="w-1.5 h-6 bg-amber-700 rounded-t-[1px]"></div>
            </div>
            <div>
              <span className="font-brand font-bold text-lg sm:text-xl tracking-wider text-slate-950 block leading-tight">
                HORIZON
              </span>
              <span className="text-[10px] tracking-[0.25em] text-slate-500 font-semibold uppercase block leading-none">
                — ESTATES —
              </span>
              <span className="text-[7.5px] tracking-wider text-amber-700 font-medium block">
                FIND YOUR NEW HORIZON
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links matching reference */}
          <nav className="hidden lg:flex items-center gap-8">
            <button 
              id="nav-home-btn"
              onClick={() => handleNavClick('hero-section')}
              className="text-xs font-bold tracking-wider text-amber-700 uppercase hover:text-amber-600 transition-colors"
            >
              HOME
            </button>
            <button 
              id="nav-about-btn"
              onClick={() => handleNavClick('about-section')}
              className="text-xs font-semibold tracking-wider text-slate-700 uppercase hover:text-amber-700 transition-colors"
            >
              ABOUT US
            </button>

            {/* Properties Dropdown */}
            <div className="relative group">
              <button 
                id="nav-properties-dropdown-btn"
                onClick={() => setPropertiesDropdownOpen(!propertiesDropdownOpen)}
                onMouseEnter={() => setPropertiesDropdownOpen(true)}
                className="flex items-center gap-1 text-xs font-semibold tracking-wider text-slate-700 uppercase hover:text-amber-700 transition-colors"
              >
                <span>PROPERTIES</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 transition-transform group-hover:rotate-180" />
              </button>

              {propertiesDropdownOpen && (
                <div 
                  onMouseLeave={() => setPropertiesDropdownOpen(false)}
                  className="absolute left-0 mt-2 w-52 bg-white rounded-lg shadow-xl border border-stone-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <button 
                    onClick={() => handleCategoryClick('All')}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-slate-800 hover:bg-amber-50 hover:text-amber-700 flex items-center justify-between"
                  >
                    <span>All Properties</span>
                    <span className="text-[10px] text-slate-400">View All</span>
                  </button>
                  <button 
                    onClick={() => handleCategoryClick('House')}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-slate-800 hover:bg-amber-50 hover:text-amber-700 flex items-center justify-between"
                  >
                    <span>Luxury Houses</span>
                    <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">Villa / House</span>
                  </button>
                  <button 
                    onClick={() => handleCategoryClick('Apartment')}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-slate-800 hover:bg-amber-50 hover:text-amber-700 flex items-center justify-between"
                  >
                    <span>Modern Apartments</span>
                    <span className="text-[10px] text-slate-500">Rent / Sale</span>
                  </button>
                  <button 
                    onClick={() => handleCategoryClick('Plot')}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-slate-800 hover:bg-amber-50 hover:text-amber-700 flex items-center justify-between"
                  >
                    <span>Prime Plots & Land</span>
                    <span className="text-[10px] text-slate-500">Acreage</span>
                  </button>
                  <button 
                    onClick={() => handleCategoryClick('Commercial')}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-slate-800 hover:bg-amber-50 hover:text-amber-700 flex items-center justify-between"
                  >
                    <span>Commercial Offices</span>
                    <span className="text-[10px] text-slate-500">Corporate</span>
                  </button>
                </div>
              )}
            </div>

            <button 
              id="nav-services-btn"
              onClick={() => handleNavClick('services-section')}
              className="text-xs font-semibold tracking-wider text-slate-700 uppercase hover:text-amber-700 transition-colors"
            >
              SERVICES
            </button>
            <button 
              id="nav-testimonials-btn"
              onClick={() => handleNavClick('testimonials-section')}
              className="text-xs font-semibold tracking-wider text-slate-700 uppercase hover:text-amber-700 transition-colors"
            >
              TESTIMONIALS
            </button>
            <button 
              id="nav-contact-btn"
              onClick={() => handleNavClick('contact-section')}
              className="text-xs font-semibold tracking-wider text-slate-700 uppercase hover:text-amber-700 transition-colors"
            >
              CONTACT
            </button>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Favorites Icon */}
            <button
              id="header-favorites-btn"
              onClick={onOpenFavorites}
              className="p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors relative"
              title="Saved Properties"
            >
              <Heart className="w-5 h-5" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Add Property Button */}
            <button
              id="header-add-property-btn"
              onClick={onOpenAddProperty}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-md border border-amber-600/30 text-amber-800 bg-amber-50 hover:bg-amber-100 transition-colors"
            >
              <Plus className="w-4 h-4 text-amber-700" />
              <span>List Property</span>
            </button>

            {/* User Auth or Profile */}
            {user ? (
              <div className="relative">
                <button
                  id="user-profile-menu-btn"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-stone-200 hover:border-amber-400 bg-white hover:bg-stone-50 transition-all focus:outline-none shadow-xs"
                >
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt={user.displayName || 'User'} 
                      className="w-7 h-7 rounded-full object-cover border border-amber-500/50"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs font-bold">
                      {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <span className="text-xs font-medium text-slate-800 max-w-[90px] truncate hidden md:inline">
                    {user.displayName || user.email?.split('@')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div 
                    onMouseLeave={() => setUserDropdownOpen(false)}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-stone-200 py-2 z-50 animate-in fade-in duration-150"
                  >
                    <div className="px-4 py-2 border-b border-stone-100">
                      <p className="text-xs font-semibold text-slate-900 truncate">
                        {user.displayName || 'Property Member'}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    </div>

                    <button
                      id="menu-my-listings-btn"
                      onClick={() => {
                        onOpenDashboard('listings');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-amber-50 hover:text-amber-800 flex items-center gap-2.5"
                    >
                      <Home className="w-4 h-4 text-amber-600" />
                      <span>My Listed Properties</span>
                    </button>

                    <button
                      id="menu-my-viewings-btn"
                      onClick={() => {
                        onOpenDashboard('viewings');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-amber-50 hover:text-amber-800 flex items-center gap-2.5"
                    >
                      <Calendar className="w-4 h-4 text-amber-600" />
                      <span>My Booked Viewings</span>
                    </button>

                    <button
                      id="menu-inquiries-btn"
                      onClick={() => {
                        onOpenDashboard('inquiries');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-amber-50 hover:text-amber-800 flex items-center gap-2.5"
                    >
                      <Layers className="w-4 h-4 text-amber-600" />
                      <span>Viewing Inquiries Received</span>
                    </button>

                    <button
                      id="menu-saved-favorites-btn"
                      onClick={() => {
                        onOpenDashboard('favorites');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-amber-50 hover:text-amber-800 flex items-center gap-2.5"
                    >
                      <Heart className="w-4 h-4 text-rose-500" />
                      <span>Saved Favorites</span>
                    </button>

                    <div className="border-t border-stone-100 my-1"></div>

                    <button
                      id="menu-logout-btn"
                      onClick={async () => {
                        await logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2.5"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                id="header-get-in-touch-btn"
                onClick={onOpenAuth}
                className="bg-[#0b1329] hover:bg-slate-900 text-white text-xs font-semibold px-5 py-2.5 rounded-md tracking-wider transition-all duration-200 shadow-sm hover:shadow"
              >
                SIGN IN
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:text-slate-900 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-stone-200 px-4 py-4 space-y-3 animate-in slide-in-from-top-4 duration-200">
            <button 
              onClick={() => handleNavClick('hero-section')}
              className="block w-full text-left py-2 text-sm font-semibold text-slate-900 hover:text-amber-700"
            >
              HOME
            </button>
            <button 
              onClick={() => handleNavClick('about-section')}
              className="block w-full text-left py-2 text-sm font-semibold text-slate-900 hover:text-amber-700"
            >
              ABOUT US
            </button>

            <div className="py-2 border-y border-stone-100">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Browse Properties</span>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => handleCategoryClick('House')}
                  className="text-left px-3 py-1.5 rounded bg-stone-50 text-xs font-medium text-slate-800 hover:bg-amber-100"
                >
                  Houses & Villas
                </button>
                <button 
                  onClick={() => handleCategoryClick('Apartment')}
                  className="text-left px-3 py-1.5 rounded bg-stone-50 text-xs font-medium text-slate-800 hover:bg-amber-100"
                >
                  Apartments
                </button>
                <button 
                  onClick={() => handleCategoryClick('Plot')}
                  className="text-left px-3 py-1.5 rounded bg-stone-50 text-xs font-medium text-slate-800 hover:bg-amber-100"
                >
                  Plots & Land
                </button>
                <button 
                  onClick={() => handleCategoryClick('Commercial')}
                  className="text-left px-3 py-1.5 rounded bg-stone-50 text-xs font-medium text-slate-800 hover:bg-amber-100"
                >
                  Commercial
                </button>
              </div>
            </div>

            <button 
              onClick={() => handleNavClick('services-section')}
              className="block w-full text-left py-2 text-sm font-semibold text-slate-900 hover:text-amber-700"
            >
              SERVICES
            </button>
            <button 
              onClick={() => handleNavClick('testimonials-section')}
              className="block w-full text-left py-2 text-sm font-semibold text-slate-900 hover:text-amber-700"
            >
              TESTIMONIALS
            </button>
            <button 
              onClick={() => handleNavClick('contact-section')}
              className="block w-full text-left py-2 text-sm font-semibold text-slate-900 hover:text-amber-700"
            >
              CONTACT
            </button>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  onOpenAddProperty();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-md bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold"
              >
                <Plus className="w-4 h-4" />
                <span>List Your Property</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
