import React, { useState } from 'react';
import { ArrowRight, Search, SlidersHorizontal, Plus, RefreshCw } from 'lucide-react';
import type { Property, PropertyFilterState, PropertyCategory } from '../types';
import { PropertyCard } from './PropertyCard';

interface FeaturedPropertiesProps {
  properties: Property[];
  loading: boolean;
  filters: PropertyFilterState;
  onFilterChange: (filters: Partial<PropertyFilterState>) => void;
  onSelectProperty: (property: Property) => void;
  onBookViewing: (property: Property) => void;
  onEditProperty: (property: Property) => void;
  onDeleteProperty: (property: Property) => void;
  onOpenAddProperty: () => void;
  favorites: string[];
  onToggleFavorite: (propertyId: string) => void;
  onResetFilters: () => void;
}

export const FeaturedProperties: React.FC<FeaturedPropertiesProps> = ({
  properties,
  loading,
  filters,
  onFilterChange,
  onSelectProperty,
  onBookViewing,
  onEditProperty,
  onDeleteProperty,
  onOpenAddProperty,
  favorites,
  onToggleFavorite,
  onResetFilters,
}) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const categories: { label: string; value: string }[] = [
    { label: 'All', value: 'All' },
    { label: 'House', value: 'House' },
    { label: 'Apartment', value: 'Apartment' },
    { label: 'Plot', value: 'Plot' },
    { label: 'Villa', value: 'Villa' },
    { label: 'Commercial', value: 'Commercial' },
  ];

  return (
    <section id="properties-section" className="py-16 sm:py-20 bg-stone-50 px-4 sm:px-8 border-b border-stone-200">
      <div className="max-w-7xl mx-auto">
        {/* Section Header matching reference */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-[11px] font-bold tracking-[0.2em] text-amber-700 uppercase mb-1.5">
              FEATURED PROPERTIES
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-950 font-serif-luxury tracking-tight">
              Explore Our Exclusive Properties
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="filter-toggle-btn"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-md border border-stone-300 bg-white text-slate-700 hover:bg-stone-100 transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600" />
              <span>Filters</span>
            </button>

            <button
              id="view-all-properties-btn"
              onClick={onResetFilters}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-900 hover:text-amber-700 uppercase tracking-wider transition-colors px-3 py-2 border border-slate-900 hover:border-amber-700 rounded-md"
            >
              <span>VIEW ALL PROPERTIES</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Category Filter Pills matching reference categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.value}
              id={`cat-pill-${cat.value.toLowerCase()}`}
              onClick={() => onFilterChange({ category: cat.value })}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all uppercase tracking-wider ${
                filters.category === cat.value
                  ? 'bg-[#0b1329] text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-stone-200/80 border border-stone-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search & Secondary Filter Bar */}
        <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-xs mb-8">
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            {/* Search query input */}
            <div className="relative w-full md:max-w-md">
              <input
                id="search-keywords-input"
                type="text"
                value={filters.searchQuery}
                onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
                placeholder="Search by title, address, city or features..."
                className="w-full pl-9 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent font-medium"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <span className="text-xs text-slate-500 whitespace-nowrap font-medium">Sort by:</span>
              <select
                id="sort-properties-select"
                value={filters.sortBy}
                onChange={(e) => onFilterChange({ sortBy: e.target.value as any })}
                className="bg-stone-50 border border-stone-200 text-slate-900 text-xs rounded-lg px-3 py-2 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="recommended">Featured / Recommended</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest Listed</option>
              </select>

              <button
                id="add-prop-section-btn"
                onClick={onOpenAddProperty}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Property</span>
              </button>
            </div>
          </div>

          {/* Collapsible Advanced Filters */}
          {showAdvancedFilters && (
            <div className="mt-4 pt-4 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-3 gap-4 animate-in fade-in duration-200">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Listing Type
                </label>
                <select
                  value={filters.listingType}
                  onChange={(e) => onFilterChange({ listingType: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 text-xs rounded-md px-3 py-2 text-slate-800"
                >
                  <option value="All">All Listing Types</option>
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Minimum Bedrooms
                </label>
                <select
                  value={filters.minBedrooms}
                  onChange={(e) => onFilterChange({ minBedrooms: Number(e.target.value) })}
                  className="w-full bg-stone-50 border border-stone-200 text-xs rounded-md px-3 py-2 text-slate-800"
                >
                  <option value={0}>Any Bedrooms</option>
                  <option value={1}>1+ Beds</option>
                  <option value={2}>2+ Beds</option>
                  <option value={3}>3+ Beds</option>
                  <option value={4}>4+ Beds</option>
                  <option value={5}>5+ Beds</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={onResetFilters}
                  className="w-full py-2 text-xs font-semibold text-slate-700 bg-stone-100 hover:bg-stone-200 rounded-md transition-colors flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Properties Grid matching reference 4-card row layout */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-xl overflow-hidden border border-stone-200 shadow-xs animate-pulse">
                <div className="w-full h-52 bg-stone-200"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-stone-200 rounded w-3/4"></div>
                  <div className="h-3 bg-stone-100 rounded w-1/2"></div>
                  <div className="h-6 bg-stone-100 rounded w-full"></div>
                  <div className="h-5 bg-amber-100 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 max-w-xl mx-auto shadow-xs">
            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-serif-luxury">No properties found</h3>
            <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto">
              We couldn't find any properties matching your current filter criteria. Try adjusting your search or reset filters.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={onResetFilters}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800"
              >
                Reset Filters
              </button>
              <button
                onClick={onOpenAddProperty}
                className="px-4 py-2 bg-amber-600 text-white text-xs font-semibold rounded-lg hover:bg-amber-700"
              >
                List Your Property
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onSelect={onSelectProperty}
                onBookViewing={onBookViewing}
                onEdit={onEditProperty}
                onDelete={onDeleteProperty}
                isFavorite={favorites.includes(property.id)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
