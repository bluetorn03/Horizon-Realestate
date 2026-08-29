import React, { useState } from 'react';
import { Search, ChevronDown, ArrowRight, Home, Key, Building } from 'lucide-react';
import type { PropertyFilterState, ListingType, PropertyCategory } from '../types';

interface HeroSectionProps {
  filters: PropertyFilterState;
  onFilterChange: (filters: Partial<PropertyFilterState>) => void;
  onSearch: () => void;
  onExploreClick: () => void;
  onLearnMoreClick: () => void;
  locationsList: string[];
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  filters,
  onFilterChange,
  onSearch,
  onExploreClick,
  onLearnMoreClick,
  locationsList,
}) => {
  const [activeTab, setActiveTab] = useState<ListingType | 'all'>('sale');

  const handleTabChange = (type: ListingType | 'all') => {
    setActiveTab(type);
    onFilterChange({ listingType: type === 'all' ? 'All' : type });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <section id="hero-section" className="relative w-full min-h-[580px] lg:min-h-[640px] flex items-center justify-center bg-slate-950 overflow-hidden pb-16 pt-12">
      {/* Background Image with Deep Gradient Overlays */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=85"
          alt="Luxury Architecture Dream Home"
          className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-1000 brightness-[0.7] contrast-[1.05]"
          referrerPolicy="no-referrer"
        />
        {/* Cinematic dark luxury gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/65 to-slate-950/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 w-full flex flex-col justify-center">
        {/* Hero Header Content */}
        <div className="max-w-2xl text-left mb-8 md:mb-12">
          {/* Eyebrow badge matching reference */}
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-amber-500 ring-4 ring-amber-500/20"></span>
            <span className="w-6 h-[1.5px] bg-amber-500/60"></span>
            <span className="text-[11px] sm:text-xs tracking-[0.2em] font-bold text-amber-400 uppercase">
              WELCOME TO HORIZON ESTATES
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight font-serif-luxury drop-shadow-md">
            FIND YOUR <span className="text-[#d8a853] font-serif-luxury">DREAM HOME</span>
          </h1>

          <p className="mt-4 text-slate-200 text-sm sm:text-base leading-relaxed max-w-xl font-light">
            Discover premium properties in prime locations. Luxury living. Exceptional Investments.
          </p>

          {/* Call to action buttons matching reference */}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button
              id="hero-explore-btn"
              onClick={onExploreClick}
              className="inline-flex items-center gap-2 bg-[#d8a853] hover:bg-[#c9973e] text-slate-950 font-bold text-xs tracking-wider uppercase px-6 py-3.5 rounded-md shadow-lg hover:shadow-amber-500/20 transition-all transform hover:-translate-y-0.5"
            >
              <span>EXPLORE PROPERTIES</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              id="hero-learn-more-btn"
              onClick={onLearnMoreClick}
              className="inline-flex items-center gap-2 bg-transparent hover:bg-white/10 text-white font-bold text-xs tracking-wider uppercase px-6 py-3.5 rounded-md border border-white/40 hover:border-white transition-all backdrop-blur-xs"
            >
              <span>LEARN MORE</span>
            </button>
          </div>
        </div>

        {/* Floating Property Search Box matching reference */}
        <div className="w-full bg-white/95 backdrop-blur-md rounded-xl p-4 sm:p-6 shadow-2xl border border-stone-200/80">
          {/* Tabs: Buy / Rent / Commercial */}
          <div className="flex items-center gap-2 mb-4 border-b border-stone-200 pb-3">
            <button
              id="search-tab-buy"
              type="button"
              onClick={() => handleTabChange('sale')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === 'sale'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-stone-100'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Buy</span>
            </button>

            <button
              id="search-tab-rent"
              type="button"
              onClick={() => handleTabChange('rent')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === 'rent'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-stone-100'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>Rent</span>
            </button>

            <button
              id="search-tab-commercial"
              type="button"
              onClick={() => handleTabChange('commercial')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === 'commercial'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-stone-100'
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              <span>Commercial</span>
            </button>
          </div>

          {/* Form Fields: Location | Property Type | Min Price | Max Price | Submit Button */}
          <form onSubmit={handleFormSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
            {/* 1. Location */}
            <div>
              <label htmlFor="search-location-select" className="block text-[11px] font-bold uppercase text-slate-700 mb-1.5 tracking-wider">
                Location
              </label>
              <div className="relative">
                <select
                  id="search-location-select"
                  value={filters.location}
                  onChange={(e) => onFilterChange({ location: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 text-slate-900 text-xs rounded-lg px-3 py-2.5 appearance-none focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent font-medium"
                >
                  <option value="">Select Location</option>
                  {locationsList.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* 2. Property Type */}
            <div>
              <label htmlFor="search-type-select" className="block text-[11px] font-bold uppercase text-slate-700 mb-1.5 tracking-wider">
                Property Type
              </label>
              <div className="relative">
                <select
                  id="search-type-select"
                  value={filters.category}
                  onChange={(e) => onFilterChange({ category: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 text-slate-900 text-xs rounded-lg px-3 py-2.5 appearance-none focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent font-medium"
                >
                  <option value="All">All Types</option>
                  <option value="House">House</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Plot">Plot / Land</option>
                  <option value="Villa">Luxury Villa</option>
                  <option value="Commercial">Commercial Office</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* 3. Min Price */}
            <div>
              <label htmlFor="search-min-price-select" className="block text-[11px] font-bold uppercase text-slate-700 mb-1.5 tracking-wider">
                Min Price
              </label>
              <div className="relative">
                <select
                  id="search-min-price-select"
                  value={filters.minPrice}
                  onChange={(e) => onFilterChange({ minPrice: Number(e.target.value) })}
                  className="w-full bg-stone-50 border border-stone-300 text-slate-900 text-xs rounded-lg px-3 py-2.5 appearance-none focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent font-medium"
                >
                  <option value={0}>Min Price (Any)</option>
                  <option value={3000}>$3,000 / mo</option>
                  <option value={500000}>$500,000</option>
                  <option value={1000000}>$1,000,000</option>
                  <option value={2000000}>$2,000,000</option>
                  <option value={5000000}>$5,000,000</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* 4. Max Price */}
            <div>
              <label htmlFor="search-max-price-select" className="block text-[11px] font-bold uppercase text-slate-700 mb-1.5 tracking-wider">
                Max Price
              </label>
              <div className="relative">
                <select
                  id="search-max-price-select"
                  value={filters.maxPrice}
                  onChange={(e) => onFilterChange({ maxPrice: Number(e.target.value) })}
                  className="w-full bg-stone-50 border border-stone-300 text-slate-900 text-xs rounded-lg px-3 py-2.5 appearance-none focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent font-medium"
                >
                  <option value={100000000}>Max Price (Any)</option>
                  <option value={10000}>$10,000 / mo</option>
                  <option value={1500000}>$1,500,000</option>
                  <option value={3000000}>$3,000,000</option>
                  <option value={6000000}>$6,000,000</option>
                  <option value={10000000}>$10,000,000+</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* 5. Submit Button */}
            <div>
              <button
                id="search-submit-btn"
                type="submit"
                className="w-full bg-[#d8a853] hover:bg-[#c9973e] text-slate-950 font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 shadow-md transition-all h-[42px] cursor-pointer"
              >
                <span>SEARCH PROPERTY</span>
                <Search className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
