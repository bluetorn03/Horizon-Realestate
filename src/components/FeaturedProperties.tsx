import React, { useState } from 'react';
import {
  ArrowRight,
  Search,
  SlidersHorizontal,
  Plus,
  RefreshCw,
  Building2,
  X,
} from 'lucide-react';
import type { Property, PropertyFilterState } from '../types';
import { PropertyCard } from './PropertyCard';
import { MagneticButton } from './MagneticButton';
import { SplitText } from './SplitText';
import {
  FURNISHING_OPTIONS,
  POSSESSION_OPTIONS,
} from '../lib/locations';
import {
  MAX_PRICE_OPTIONS,
  MIN_PRICE_OPTIONS,
  formatINRCompact,
} from '../lib/format';

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

const CATEGORIES = [
  { label: 'All', value: 'All' },
  { label: 'Apartments', value: 'Apartment' },
  { label: 'Villas', value: 'Villa' },
  { label: 'Houses', value: 'House' },
  { label: 'Plots', value: 'Plot' },
  { label: 'Commercial', value: 'Commercial' },
];

const SORTS = [
  { value: 'recommended', label: 'Featured first' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest listings' },
  { value: 'area-desc', label: 'Largest area first' },
  { value: 'rate-asc', label: 'Best ₹ per sq ft' },
];

const BEDROOM_OPTIONS = [0, 1, 2, 3, 4, 5];
const AREA_OPTIONS = [0, 500, 1000, 1500, 2000, 3000];

const selectClass =
  'w-full appearance-none rounded-lg border border-bone-300 bg-white px-3 py-2 text-xs font-medium text-ink-900 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30';

const labelClass = 'mb-1 block text-[10px] font-bold uppercase tracking-[0.16em] text-ink-700';

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

  const activeFilterCount =
    (filters.listingType !== 'All' ? 1 : 0) +
    (filters.minBedrooms > 0 ? 1 : 0) +
    (filters.minArea > 0 ? 1 : 0) +
    (filters.furnishing !== 'All' ? 1 : 0) +
    (filters.possession !== 'All' ? 1 : 0) +
    (filters.reraOnly ? 1 : 0) +
    (filters.minPrice > 0 ? 1 : 0) +
    (filters.maxPrice > 0 ? 1 : 0) +
    (filters.location ? 1 : 0);

  return (
    <section
      id="properties-section"
      className="border-b border-bone-200 bg-bone-50 px-4 py-20 sm:px-8 sm:py-24"
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.28em] text-gold-600">
              Available Now
            </p>
            <SplitText
              as="h2"
              text="Explore the current portfolio"
              className="font-display text-3xl font-bold leading-tight tracking-tight text-ink-950 sm:text-4xl lg:text-5xl"
            />
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-bone-500">
              {loading
                ? 'Loading verified residences from our marketplace…'
                : `${properties.length} ${properties.length === 1 ? 'residence' : 'residences'} match your criteria — priced in ₹, measured in sq ft.`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              id="filter-toggle-btn"
              onClick={() => setShowAdvancedFilters((open) => !open)}
              aria-expanded={showAdvancedFilters}
              className="inline-flex items-center gap-2 rounded-md border border-bone-300 bg-white px-3.5 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-ink-700 transition-colors hover:border-gold-400 hover:text-gold-700"
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-gold-600" />
              Filters
              {activeFilterCount > 0 && (
                <span className="grid h-4 min-w-4 place-items-center rounded-full bg-gold-500 px-1 text-[10px] font-bold text-ink-950">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <MagneticButton id="view-all-properties-btn" variant="outline" size="sm" onClick={onResetFilters}>
              Reset
              <ArrowRight className="h-3.5 w-3.5" />
            </MagneticButton>
          </div>
        </div>

        {/* Category pills */}
        <div className="scrollbar-none mb-6 flex items-center gap-2 overflow-x-auto pb-2">
          {CATEGORIES.map((category) => {
            const isActive = filters.category === category.value;
            return (
              <button
                key={category.value}
                type="button"
                id={`cat-pill-${category.value.toLowerCase()}`}
                onClick={() => onFilterChange({ category: category.value })}
                aria-pressed={isActive}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] transition-all duration-300 ${
                  isActive
                    ? 'bg-ink-900 text-bone-50 shadow-lux-md'
                    : 'border border-bone-300 bg-white text-ink-700 hover:border-gold-400 hover:text-gold-700'
                }`}
              >
                {category.label}
              </button>
            );
          })}
        </div>

        {/* Search + sort */}
        <div className="mb-8 rounded-xl border border-bone-300/70 bg-white p-4 shadow-lux-sm">
          <div className="flex flex-col items-center gap-3 md:flex-row md:justify-between">
            <div className="relative w-full md:max-w-md">
              <input
                id="search-keywords-input"
                type="search"
                value={filters.searchQuery}
                onChange={(event) => onFilterChange({ searchQuery: event.target.value })}
                placeholder="Search by project, locality, RERA number or amenity…"
                className="w-full rounded-lg border border-bone-300 bg-bone-50 py-2.5 pl-9 pr-4 text-xs font-medium text-ink-900 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
              />
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-bone-400" />
            </div>

            <div className="flex w-full items-center justify-end gap-3 md:w-auto">
              <span className="whitespace-nowrap text-[11px] font-medium text-bone-500">Sort by</span>
              <select
                id="sort-properties-select"
                value={filters.sortBy}
                onChange={(event) =>
                  onFilterChange({ sortBy: event.target.value as PropertyFilterState['sortBy'] })
                }
                className="rounded-lg border border-bone-300 bg-bone-50 px-3 py-2 text-xs font-semibold text-ink-900 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
              >
                {SORTS.map((sort) => (
                  <option key={sort.value} value={sort.value}>
                    {sort.label}
                  </option>
                ))}
              </select>

              <button
                type="button"
                id="add-prop-section-btn"
                onClick={onOpenAddProperty}
                className="hidden items-center gap-1.5 rounded-lg bg-gold-500 px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-ink-950 shadow-sm transition-colors hover:bg-gold-400 sm:inline-flex"
              >
                <Plus className="h-3.5 w-3.5" />
                List Property
              </button>
            </div>
          </div>

          {/* Advanced filters */}
          {showAdvancedFilters && (
            <div className="mt-5 grid grid-cols-1 gap-4 border-t border-bone-200 pt-5 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label htmlFor="filter-listing-type" className={labelClass}>
                  Listing Type
                </label>
                <select
                  id="filter-listing-type"
                  value={filters.listingType}
                  onChange={(event) => onFilterChange({ listingType: event.target.value })}
                  className={selectClass}
                >
                  <option value="All">All</option>
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                  <option value="commercial">Commercial Lease</option>
                </select>
              </div>

              <div>
                <label htmlFor="filter-bedrooms" className={labelClass}>
                  Configuration
                </label>
                <select
                  id="filter-bedrooms"
                  value={filters.minBedrooms}
                  onChange={(event) => onFilterChange({ minBedrooms: Number(event.target.value) })}
                  className={selectClass}
                >
                  {BEDROOM_OPTIONS.map((value) => (
                    <option key={value} value={value}>
                      {value === 0 ? 'Any BHK' : `${value}+ BHK`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="filter-area" className={labelClass}>
                  Minimum Area
                </label>
                <select
                  id="filter-area"
                  value={filters.minArea}
                  onChange={(event) => onFilterChange({ minArea: Number(event.target.value) })}
                  className={selectClass}
                >
                  {AREA_OPTIONS.map((value) => (
                    <option key={value} value={value}>
                      {value === 0 ? 'Any area' : `${value.toLocaleString('en-IN')}+ sq ft`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="filter-furnishing" className={labelClass}>
                  Furnishing
                </label>
                <select
                  id="filter-furnishing"
                  value={filters.furnishing}
                  onChange={(event) => onFilterChange({ furnishing: event.target.value })}
                  className={selectClass}
                >
                  <option value="All">Any</option>
                  {FURNISHING_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="filter-possession" className={labelClass}>
                  Possession
                </label>
                <select
                  id="filter-possession"
                  value={filters.possession}
                  onChange={(event) => onFilterChange({ possession: event.target.value })}
                  className={selectClass}
                >
                  <option value="All">Any stage</option>
                  {POSSESSION_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="filter-min-price" className={labelClass}>
                  Budget From
                </label>
                <select
                  id="filter-min-price"
                  value={filters.minPrice}
                  onChange={(event) => onFilterChange({ minPrice: Number(event.target.value) })}
                  className={selectClass}
                >
                  {MIN_PRICE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="filter-max-price" className={labelClass}>
                  Budget To
                </label>
                <select
                  id="filter-max-price"
                  value={filters.maxPrice}
                  onChange={(event) => onFilterChange({ maxPrice: Number(event.target.value) })}
                  className={selectClass}
                >
                  {MAX_PRICE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={onResetFilters}
                  className="flex w-full items-center justify-center gap-1.5 rounded-md bg-bone-100 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-ink-700 transition-colors hover:bg-bone-200"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Reset All
                </button>
              </div>

              <label className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-bone-300 bg-bone-50 px-3 py-2 sm:col-span-2 lg:col-span-4">
                <input
                  id="filter-rera-only"
                  type="checkbox"
                  checked={filters.reraOnly}
                  onChange={(event) => onFilterChange({ reraOnly: event.target.checked })}
                  className="h-4 w-4 rounded border-bone-400 text-gold-600 focus:ring-gold-500"
                />
                <span className="text-xs font-semibold text-ink-800">
                  Show RERA-registered projects only
                </span>
              </label>
            </div>
          )}
        </div>

        {/* Active budget summary */}
        {(filters.minPrice > 0 || filters.maxPrice > 0) && (
          <p className="mb-5 text-[11px] font-medium text-bone-500">
            Budget:{' '}
            <span className="font-bold text-ink-800">
              {filters.minPrice > 0 ? formatINRCompact(filters.minPrice) : '₹0'} –{' '}
              {filters.maxPrice > 0 ? formatINRCompact(filters.maxPrice) : 'no limit'}
            </span>
          </p>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse overflow-hidden rounded-xl border border-bone-200 bg-white shadow-lux-sm"
              >
                <div className="aspect-[4/3] w-full bg-bone-200" />
                <div className="space-y-3 p-5">
                  <div className="h-4 w-3/4 rounded bg-bone-200" />
                  <div className="h-3 w-1/2 rounded bg-bone-100" />
                  <div className="h-8 w-full rounded bg-bone-100" />
                  <div className="h-6 w-1/3 rounded bg-gold-100" />
                </div>
              </div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="mx-auto max-w-xl rounded-2xl border border-bone-200 bg-white p-12 text-center shadow-lux-sm">
            <span className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-gold-50 text-gold-600">
              <Search className="h-7 w-7" />
            </span>
            <h3 className="font-display text-lg font-bold text-ink-900">No residences match yet</h3>
            <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-bone-500">
              Try widening the budget range, clearing the locality filter, or searching a different
              city such as Thane or Hyderabad.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <MagneticButton variant="ink" size="sm" onClick={onResetFilters}>
                <X className="h-3.5 w-3.5" />
                Clear Filters
              </MagneticButton>
              <MagneticButton variant="gold" size="sm" onClick={onOpenAddProperty}>
                <Plus className="h-3.5 w-3.5" />
                List Your Property
              </MagneticButton>
            </div>
          </div>
        ) : (
          <div
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            data-reveal-stagger
          >
            {properties.map((property) => (
              <div key={property.id} data-reveal-item>
                <PropertyCard
                  property={property}
                  onSelect={onSelectProperty}
                  onBookViewing={onBookViewing}
                  onEdit={onEditProperty}
                  onDelete={onDeleteProperty}
                  isFavorite={favorites.includes(property.id)}
                  onToggleFavorite={onToggleFavorite}
                />
              </div>
            ))}
          </div>
        )}

        {/* Marketplace CTA */}
        <div className="mt-16 overflow-hidden rounded-2xl border border-bone-300/70 bg-white shadow-lux-md">
          <div className="grid grid-cols-1 items-center gap-8 p-8 sm:p-10 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-gold-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-gold-700">
                <Building2 className="h-3.5 w-3.5" />
                Owner Marketplace
              </span>
              <h3 className="font-display text-2xl font-bold leading-tight text-ink-950 sm:text-3xl">
                Selling or letting your residence in India?
              </h3>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-bone-500">
                List with Horizon Estates and reach pre-qualified buyers and tenants. You control the
                ₹ pricing, the carpet-area figures and every viewing request — our advisors handle
                diligence, photography and negotiation.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <MagneticButton id="footer-list-property-btn" variant="gold" size="md" onClick={onOpenAddProperty}>
                <Plus className="h-4 w-4" />
                List Your Property
              </MagneticButton>
              <p className="text-center text-[11px] text-bone-500">
                Free listing · No brokerage from owners
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
