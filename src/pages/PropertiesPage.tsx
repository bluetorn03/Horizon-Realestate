import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageHero } from '../components/layout/PageHero';
import { FeaturedProperties } from '../components/FeaturedProperties';
import { useSite } from '../context/SiteContext';
import type { PropertyFilterState } from '../types';

export const PropertiesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const {
    loading,
    favorites,
    filters,
    filteredProperties,
    handleFilterChange,
    resetFilters,
    viewProperty,
    openBookViewing,
    openEditProperty,
    removeProperty,
    openAddProperty,
    toggleFavorite,
  } = useSite();

  // Apply deep-link filters (e.g. /properties?category=Villa)
  useEffect(() => {
    const category = searchParams.get('category');
    const listingType = searchParams.get('listingType');
    const q = searchParams.get('q');
    const next: Partial<PropertyFilterState> = {};
    if (category) next.category = category;
    if (listingType) next.listingType = listingType;
    if (q) next.searchQuery = q;
    if (Object.keys(next).length > 0) handleFilterChange(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <>
      <PageHero
        crumb="Properties"
        eyebrow="OUR PORTFOLIO"
        title="Find Your Next Address"
        description="Browse our curated collection of luxury residences, land parcels and commercial assets across India — every listing title-verified and RERA-checked."
        image="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2000&q=85"
      />

      <FeaturedProperties
        eyebrow="ALL LISTINGS"
        title="Explore Our Exclusive Properties"
        properties={filteredProperties}
        loading={loading}
        filters={filters}
        onFilterChange={handleFilterChange}
        onSelectProperty={viewProperty}
        onBookViewing={openBookViewing}
        onEditProperty={openEditProperty}
        onDeleteProperty={removeProperty}
        onOpenAddProperty={openAddProperty}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
        onResetFilters={resetFilters}
      />
    </>
  );
};
