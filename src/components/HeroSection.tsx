import React, { Suspense, lazy, useEffect, useMemo, useRef } from 'react';
import { Search, ChevronDown, ArrowRight, Home, Key, Building2, ArrowDown } from 'lucide-react';
import type { PropertyFilterState, ListingType } from '../types';
import { usePrefersReducedMotion } from '../hooks/useReducedMotion';
import { useWebGLSupport, usePrefersLightweight3D } from '../hooks/useWebGLSupport';
import { MAX_PRICE_OPTIONS, MIN_PRICE_OPTIONS } from '../lib/format';
import { heroImage } from '../lib/images';
import { INDIAN_CITIES } from '../lib/locations';
import { scrollToSection } from '../lib/scroll';
import { ScrollTrigger } from '../lib/gsap';
import { heroSceneState } from '../lib/sceneState';
import { MagneticButton } from './MagneticButton';
import { SplitText } from './SplitText';
import { Marquee } from './Marquee';

/** Heavy WebGL hero — code-split away from the initial bundle. */
const HeroScene = lazy(() => import('./three/HeroScene'));

interface HeroSectionProps {
  filters: PropertyFilterState;
  onFilterChange: (filters: Partial<PropertyFilterState>) => void;
  onSearch: () => void;
  onExploreClick: () => void;
  onLearnMoreClick: () => void;
  locationsList: string[];
}

const TABS: { id: ListingType; label: string; icon: typeof Home }[] = [
  { id: 'sale', label: 'Buy', icon: Home },
  { id: 'rent', label: 'Rent', icon: Key },
  { id: 'commercial', label: 'Commercial', icon: Building2 },
];

const MARQUEE_ITEMS = [
  'RERA Verified Inventory',
  'Mumbai',
  'Navi Mumbai',
  'Thane',
  'Pune',
  'Bengaluru',
  'Hyderabad',
  'Delhi NCR',
  'Goa',
  'Carpet Area Transparency',
  'Private Viewings Within 48 Hours',
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  filters,
  onFilterChange,
  onSearch,
  onExploreClick,
  onLearnMoreClick,
  locationsList,
}) => {
  const [activeTab, setActiveTab] = React.useState<ListingType | 'all'>('sale');
  const reducedMotion = usePrefersReducedMotion();
  const webgl = useWebGLSupport();
  const lightweight = usePrefersLightweight3D();

  const locationOptions = useMemo(() => {
    const set = new Set<string>();
    // City names first (these match `property.city`), then the micro-markets
    // that actually exist in the inventory (they match `property.location`).
    INDIAN_CITIES.forEach((city) => set.add(city.name));
    locationsList.forEach((location) => {
      if (location) set.add(location);
    });
    return Array.from(set).slice(0, 48);
  }, [locationsList]);

  const handleTabChange = (type: ListingType | 'all') => {
    setActiveTab(type);
    onFilterChange({ listingType: type === 'all' ? 'All' : type });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSearch();
  };

  const showScene = webgl;
  const sectionRef = useRef<HTMLElement>(null);

  /**
   * Feed the WebGL hero scene from real scroll + pointer input.
   * Writing to the shared mutable store keeps the render loop free of React
   * re-renders while still giving genuine scroll-controlled camera movement.
   */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        heroSceneState.scrollProgress = self.progress;
      },
      onLeaveBack: () => {
        heroSceneState.scrollProgress = 0;
      },
    });

    const onPointerMove = (event: PointerEvent) => {
      heroSceneState.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      heroSceneState.pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
      heroSceneState.pointerActive = true;
    };
    const onPointerLeave = () => {
      heroSceneState.pointer.x = 0;
      heroSceneState.pointer.y = 0;
      heroSceneState.pointerActive = false;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointerleave', onPointerLeave);

    return () => {
      trigger.kill();
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerleave', onPointerLeave);
      heroSceneState.scrollProgress = 0;
      heroSceneState.pointer.x = 0;
      heroSceneState.pointer.y = 0;
      heroSceneState.pointerActive = false;
    };
  }, []);

  return (
    <section
      id="hero-section"
      ref={sectionRef}
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden wash-hero pb-10 pt-14"
    >
      {/* ---------------- Background: photograph + 3D scene ---------------- */}
      <div className="absolute inset-0" aria-hidden="true">
        <img
          src={heroImage('photo-1753806389001-80e994bfbf04', 2000)}
          alt=""
          width={2000}
          height={1200}
          fetchPriority="high"
          decoding="async"
          referrerPolicy="no-referrer"
          className="h-full w-full scale-105 object-cover object-center opacity-[0.55]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950/92 via-ink-950/70 to-ink-950/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-ink-950/50" />

        {showScene ? (
          <div className="absolute inset-0">
            <Suspense fallback={null}>
              <HeroScene
                reducedMotion={reducedMotion}
                lightweight={lightweight}
                className="!absolute inset-0 h-full w-full"
              />
            </Suspense>
          </div>
        ) : null}
      </div>

      {/* ---------------- Content ---------------- */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-8">
        <div className="max-w-3xl">
          <p className="mb-4 flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.3em] text-gold-300">
            <span className="h-1.5 w-1.5 rounded-full bg-gold-400 ring-4 ring-gold-400/20" />
            <span className="h-[1.5px] w-8 bg-gold-400/50" />
            Horizon Estates · India
          </p>

          <h1 className="font-display text-[2.6rem] font-bold leading-[1.02] tracking-tight text-bone-50 sm:text-6xl lg:text-7xl">
            <SplitText text="Find your address" mode="words" />
            <br />
            <span className="text-gold-300">
              <SplitText text="in India's finest" mode="words" delay={0.12} />
            </span>
            <br />
            <SplitText text="neighbourhoods" mode="words" delay={0.24} />
          </h1>

          <p className="mt-6 max-w-xl text-sm leading-relaxed text-bone-300 sm:text-base">
            Curated residences across Mumbai, Navi Mumbai, Thane, Pune, Bengaluru, Hyderabad, Delhi
            NCR and Goa — priced in ₹, measured in sq ft of carpet area, and RERA verified before
            they reach you.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <MagneticButton id="hero-explore-btn" variant="gold" size="lg" onClick={onExploreClick}>
              Explore Residences
              <ArrowRight className="h-4 w-4" />
            </MagneticButton>
            <MagneticButton
              id="hero-learn-more-btn"
              variant="outline"
              size="lg"
              onClick={onLearnMoreClick}
              className="border-bone-100/40 text-bone-50 hover:border-gold-300 hover:text-gold-200"
            >
              The Horizon Approach
            </MagneticButton>
          </div>
        </div>

        {/* ---------------- Search console ---------------- */}
        <div className="mt-10 w-full rounded-2xl border border-bone-200/70 bg-bone-50/95 p-4 shadow-lux-lg backdrop-blur-md sm:p-6">
          <div className="mb-4 flex flex-wrap items-center gap-2 border-b border-bone-200 pb-4">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  id={`search-tab-${tab.id}`}
                  onClick={() => handleTabChange(tab.id)}
                  aria-pressed={isActive}
                  className={`flex items-center gap-2 rounded-md px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.16em] transition-all duration-300 ${
                    isActive
                      ? 'bg-ink-900 text-bone-50 shadow-sm'
                      : 'text-ink-600 hover:bg-bone-200/70 hover:text-ink-950'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {tab.label}
                </button>
              );
            })}
            <span className="ml-auto hidden text-[11px] font-medium text-bone-500 sm:block">
              {activeTab === 'rent'
                ? 'Monthly rentals, all-inclusive of maintenance'
                : activeTab === 'commercial'
                  ? 'Grade-A offices across India’s business districts'
                  : 'Freehold, RERA registered, clear title'}
            </span>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5"
          >
            <div className="lg:col-span-1">
              <label
                htmlFor="search-location-select"
                className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.16em] text-ink-700"
              >
                Location
              </label>
              <div className="relative">
                <select
                  id="search-location-select"
                  value={filters.location}
                  onChange={(event) => onFilterChange({ location: event.target.value })}
                  className="w-full appearance-none rounded-lg border border-bone-300 bg-white px-3 py-2.5 text-xs font-medium text-ink-900 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
                >
                  <option value="">All India</option>
                  {locationOptions.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-bone-400" />
              </div>
            </div>

            <div>
              <label
                htmlFor="search-type-select"
                className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.16em] text-ink-700"
              >
                Property Type
              </label>
              <div className="relative">
                <select
                  id="search-type-select"
                  value={filters.category}
                  onChange={(event) => onFilterChange({ category: event.target.value })}
                  className="w-full appearance-none rounded-lg border border-bone-300 bg-white px-3 py-2.5 text-xs font-medium text-ink-900 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
                >
                  <option value="All">All Types</option>
                  <option value="Apartment">Apartment / Flat</option>
                  <option value="Villa">Villa</option>
                  <option value="House">House / Bungalow</option>
                  <option value="Plot">Residential Plot</option>
                  <option value="Commercial">Commercial Office</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-bone-400" />
              </div>
            </div>

            <div>
              <label
                htmlFor="search-min-price-select"
                className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.16em] text-ink-700"
              >
                Budget From
              </label>
              <div className="relative">
                <select
                  id="search-min-price-select"
                  value={filters.minPrice}
                  onChange={(event) => onFilterChange({ minPrice: Number(event.target.value) })}
                  className="w-full appearance-none rounded-lg border border-bone-300 bg-white px-3 py-2.5 text-xs font-medium text-ink-900 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
                >
                  {MIN_PRICE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-bone-400" />
              </div>
            </div>

            <div>
              <label
                htmlFor="search-max-price-select"
                className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.16em] text-ink-700"
              >
                Budget To
              </label>
              <div className="relative">
                <select
                  id="search-max-price-select"
                  value={filters.maxPrice}
                  onChange={(event) => onFilterChange({ maxPrice: Number(event.target.value) })}
                  className="w-full appearance-none rounded-lg border border-bone-300 bg-white px-3 py-2.5 text-xs font-medium text-ink-900 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
                >
                  {MAX_PRICE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-bone-400" />
              </div>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                id="search-submit-btn"
                className="flex h-[42px] w-full items-center justify-center gap-2 rounded-lg bg-gold-500 text-[11px] font-bold uppercase tracking-[0.16em] text-ink-950 shadow-md transition-colors duration-300 hover:bg-gold-400"
              >
                Search
                <Search className="h-3.5 w-3.5 stroke-[2.5]" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ---------------- Marquee + scroll cue ---------------- */}
      <div className="relative z-10 mt-10">
        <Marquee
          items={MARQUEE_ITEMS}
          duration={38}
          itemClassName="text-[11px] font-bold uppercase tracking-[0.28em] text-bone-400"
          separator={<span className="mx-6 text-gold-500">◆</span>}
        />
      </div>

      <button
        type="button"
        onClick={() => scrollToSection('collection-marquee')}
        className="absolute bottom-4 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-1.5 text-bone-500 transition-colors hover:text-gold-300 lg:flex"
        aria-label="Scroll to the signature collection"
      >
        <span className="text-[9px] font-bold uppercase tracking-[0.3em]">Scroll</span>
        <ArrowDown className="h-4 w-4 animate-bounce" />
      </button>
    </section>
  );
};
