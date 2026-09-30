import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
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
  Layers,
  Facebook,
  Instagram,
  Linkedin,
  Twitter
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSite } from '../context/SiteContext';
import { SITE, NAV_LINKS } from '../data/site';

const PROPERTY_MENU = [
  { label: 'All Properties', hint: 'View All', category: 'All' },
  { label: 'Luxury Houses', hint: 'Villa / House', category: 'House' },
  { label: 'Modern Apartments', hint: 'Rent / Sale', category: 'Apartment' },
  { label: 'Prime Plots & Land', hint: 'Acreage', category: 'Plot' },
  { label: 'Commercial Offices', hint: 'Corporate', category: 'Commercial' },
];

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { openAuth, openAddProperty, openDashboard, favorites } = useSite();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [propertiesDropdownOpen, setPropertiesDropdownOpen] = useState(false);

  const goToCategory = (category: string) => {
    navigate(category === 'All' ? '/properties' : `/properties?category=${encodeURIComponent(category)}`);
    setPropertiesDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-xs font-semibold tracking-wider uppercase transition-colors ${
      isActive ? 'text-amber-700 font-bold' : 'text-slate-700 hover:text-amber-700'
    }`;

  return (
    <header className="w-full relative z-40">
      {/* Top Luxury Bar */}
      <div className="bg-[#0b1329] text-slate-300 text-xs py-2 px-4 sm:px-8 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-6">
            <div className="flex items-center gap-1.5 hover:text-amber-400 transition-colors">
              <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="hidden lg:inline">{SITE.headquarters}</span>
              <span className="lg:hidden">Mumbai · Bengaluru · Gurugram</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 hover:text-amber-400 transition-colors">
              <Phone className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <a href={`tel:${SITE.phone.replace(/\s/g, '')}`}>{SITE.phone}</a>
            </div>
            <div className="hidden md:flex items-center gap-1.5 hover:text-amber-400 transition-colors">
              <Mail className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-slate-400">Follow Us:</span>
            <div className="flex items-center gap-3">
              <a href="#facebook" className="text-slate-400 hover:text-amber-400 transition-colors" aria-label="Facebook">
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a href="#instagram" className="text-slate-400 hover:text-amber-400 transition-colors" aria-label="Instagram">
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a href="#linkedin" className="text-slate-400 hover:text-amber-400 transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-3.5 h-3.5" />
              </a>
              <a href="#twitter" className="text-slate-400 hover:text-amber-400 transition-colors" aria-label="Twitter">
                <Twitter className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Luxury Header */}
      <div className="bg-white/95 backdrop-blur-md shadow-sm border-b border-stone-200 transition-all sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            id="brand-logo-btn"
            onClick={() => setMobileMenuOpen(false)}
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
                {SITE.tagline.toUpperCase()}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7">
            <NavLink to="/" end className={navLinkClass} id="nav-home-btn">
              HOME
            </NavLink>
            <NavLink to="/about" className={navLinkClass} id="nav-about-btn">
              ABOUT US
            </NavLink>

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
                  className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-stone-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  {PROPERTY_MENU.map((item) => (
                    <button
                      key={item.category}
                      onClick={() => goToCategory(item.category)}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-slate-800 hover:bg-amber-50 hover:text-amber-700 flex items-center justify-between"
                    >
                      <span>{item.label}</span>
                      <span className="text-[10px] text-slate-400">{item.hint}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <NavLink to="/services" className={navLinkClass} id="nav-services-btn">
              SERVICES
            </NavLink>
            <NavLink to="/agents" className={navLinkClass} id="nav-agents-btn">
              ADVISORS
            </NavLink>
            <NavLink to="/insights" className={navLinkClass} id="nav-insights-btn">
              INSIGHTS
            </NavLink>
            <NavLink to="/contact" className={navLinkClass} id="nav-contact-btn">
              CONTACT
            </NavLink>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button
              id="header-favorites-btn"
              onClick={() => openDashboard('favorites')}
              className="p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors relative"
              title="Saved Properties"
            >
              <Heart className="w-5 h-5" />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {favorites.length}
                </span>
              )}
            </button>

            <button
              id="header-add-property-btn"
              onClick={openAddProperty}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-md border border-amber-600/30 text-amber-800 bg-amber-50 hover:bg-amber-100 transition-colors"
            >
              <Plus className="w-4 h-4 text-amber-700" />
              <span>List Property</span>
            </button>

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

                    {[
                      { id: 'menu-my-listings-btn', tab: 'listings' as const, icon: Home, label: 'My Listed Properties' },
                      { id: 'menu-my-viewings-btn', tab: 'viewings' as const, icon: Calendar, label: 'My Booked Viewings' },
                      { id: 'menu-inquiries-btn', tab: 'inquiries' as const, icon: Layers, label: 'Viewing Inquiries Received' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        id={item.id}
                        onClick={() => {
                          openDashboard(item.tab);
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-amber-50 hover:text-amber-800 flex items-center gap-2.5"
                      >
                        <item.icon className="w-4 h-4 text-amber-600" />
                        <span>{item.label}</span>
                      </button>
                    ))}

                    <button
                      id="menu-saved-favorites-btn"
                      onClick={() => {
                        openDashboard('favorites');
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
                onClick={openAuth}
                className="bg-[#0b1329] hover:bg-slate-900 text-white text-xs font-semibold px-5 py-2.5 rounded-md tracking-wider transition-all duration-200 shadow-sm hover:shadow"
              >
                SIGN IN
              </button>
            )}

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
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block w-full text-left py-2 text-sm font-semibold ${isActive ? 'text-amber-700' : 'text-slate-900 hover:text-amber-700'}`
                }
              >
                {link.label.toUpperCase()}
              </NavLink>
            ))}

            <div className="py-2 border-y border-stone-100">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Browse Properties</span>
              <div className="grid grid-cols-2 gap-2">
                {['House', 'Apartment', 'Plot', 'Commercial'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => goToCategory(cat)}
                    className="text-left px-3 py-1.5 rounded bg-stone-50 text-xs font-medium text-slate-800 hover:bg-amber-100"
                  >
                    {cat === 'House' ? 'Houses & Villas' : cat === 'Plot' ? 'Plots & Land' : cat === 'Apartment' ? 'Apartments' : 'Commercial'}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  openAddProperty();
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
