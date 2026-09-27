import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { TrustBadges } from './components/TrustBadges';
import { PropertyMarquee } from './components/PropertyMarquee';
import { FeaturedProperties } from './components/FeaturedProperties';
import { StatsCounter } from './components/StatsCounter';
import { ArchitectureVisualizer } from './components/ArchitectureVisualizer';
import { HorizontalStory } from './components/HorizontalStory';
import { AboutSection } from './components/AboutSection';
import { ServicesSection } from './components/ServicesSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { Preloader } from './components/Preloader';
import { CursorGlow } from './components/CursorGlow';

import { PropertyDetailsModal } from './components/PropertyDetailsModal';
import { BookViewingModal } from './components/BookViewingModal';
import { AddEditPropertyModal } from './components/AddEditPropertyModal';
import { UserDashboardModal } from './components/UserDashboardModal';
import { AuthModal } from './components/AuthModal';

import type { Property, PropertyFilterState, Viewing, DashboardTab } from './types';
import { fetchAllProperties, deleteProperty } from './lib/firebase';
import { getLenis, scrollToSection } from './lib/scroll';
import { initScrollAnimations } from './lib/reveal';
import { INDIAN_CITIES } from './lib/locations';

const DEFAULT_FILTERS: PropertyFilterState = {
  searchQuery: '',
  category: 'All',
  listingType: 'All',
  location: '',
  minPrice: 0,
  maxPrice: 0,
  minBedrooms: 0,
  minArea: 0,
  furnishing: 'All',
  possession: 'All',
  reraOnly: false,
  sortBy: 'recommended',
};

const CITY_ALIASES = INDIAN_CITIES.flatMap((city) => [city.name, ...city.microMarkets]);

function MainApp() {
  const { user } = useAuth();

  const [appReady, setAppReady] = useState(false);
  const handlePreloaderComplete = useCallback(() => setAppReady(true), []);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<PropertyFilterState>(DEFAULT_FILTERS);

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = window.localStorage.getItem('horizon_favorites');
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
    } catch {
      return [];
    }
  });

  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [bookingProperty, setBookingProperty] = useState<Property | null>(null);
  const [propertyToEdit, setPropertyToEdit] = useState<Property | null>(null);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDashboardModal, setShowDashboardModal] = useState(false);
  const [dashboardTab, setDashboardTab] = useState<DashboardTab>('listings');

  /* ---------------- Initialisation ---------------- */

  useEffect(() => {
    // Start smooth scrolling as early as possible.
    getLenis();
    const timer = window.setTimeout(() => setAppReady(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchAllProperties();
        if (!cancelled) setProperties(data);
      } catch (error) {
        console.error('Failed to load properties:', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Initialise scroll choreography once the listing grid has rendered.
  useEffect(() => {
    if (loading) return;
    const frame = requestAnimationFrame(() => initScrollAnimations());
    return () => cancelAnimationFrame(frame);
  }, [loading, properties.length]);

  useEffect(() => {
    try {
      window.localStorage.setItem('horizon_favorites', JSON.stringify(favorites));
    } catch (error) {
      console.error('Unable to persist shortlist:', error);
    }
  }, [favorites]);

  /* ---------------- Derived data ---------------- */

  const locationsList = useMemo(() => {
    const set = new Set<string>();
    properties.forEach((property) => {
      if (property.location) set.add(property.location);
      if (property.city) set.add(property.city);
    });
    return Array.from(set);
  }, [properties]);

  const filteredProperties = useMemo(() => {
    const query = filters.searchQuery.trim().toLowerCase();

    const matchesQuery = (property: Property) => {
      if (!query) return true;
      return [
        property.title,
        property.description,
        property.location,
        property.city,
        property.address,
        property.category,
        property.rera ?? '',
        ...(property.amenities || []),
      ]
        .join(' ')
        .toLowerCase()
        .includes(query);
    };

    const filtered = properties.filter((property) => {
      if (!matchesQuery(property)) return false;

      if (filters.category !== 'All') {
        const isMatch =
          property.category.toLowerCase() === filters.category.toLowerCase() ||
          (filters.category === 'House' && property.category === 'Villa');
        if (!isMatch) return false;
      }

      if (filters.listingType !== 'All' && property.listingType !== filters.listingType) {
        return false;
      }

      if (filters.location) {
        const needle = filters.location.toLowerCase();
        const haystack = [property.location, property.city, property.address]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(needle)) return false;
      }

      if (filters.minPrice > 0 && property.price < filters.minPrice) return false;
      if (filters.maxPrice > 0 && property.price > filters.maxPrice) return false;
      if (filters.minBedrooms > 0 && property.bedrooms < filters.minBedrooms) return false;
      if (filters.minArea > 0 && property.sqft < filters.minArea) return false;
      if (filters.furnishing !== 'All' && property.furnishing !== filters.furnishing) return false;
      if (filters.possession !== 'All' && property.possession !== filters.possession) return false;
      if (filters.reraOnly && !property.rera) return false;

      return true;
    });

    const byDate = (a: Property, b: Property) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

    return [...filtered].sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'newest':
          return byDate(a, b);
        case 'area-desc':
          return (b.sqft || 0) - (a.sqft || 0);
        case 'rate-asc': {
          const rateA = a.sqft ? a.price / a.sqft : Number.POSITIVE_INFINITY;
          const rateB = b.sqft ? b.price / b.sqft : Number.POSITIVE_INFINITY;
          return rateA - rateB;
        }
        default:
          if (Boolean(a.featured) !== Boolean(b.featured)) return a.featured ? -1 : 1;
          return byDate(a, b);
      }
    });
  }, [properties, filters]);

  /* ---------------- Handlers ---------------- */

  const handleFilterChange = useCallback((changes: Partial<PropertyFilterState>) => {
    setFilters((previous) => ({ ...previous, ...changes }));
  }, []);

  const handleResetFilters = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  const handleScrollToSection = useCallback((sectionId: string) => {
    scrollToSection(sectionId, 0);
  }, []);

  const handleSelectLocation = useCallback((city: string) => {
    const needle = city.toLowerCase();
    const isKnown = CITY_ALIASES.some((alias) => alias.toLowerCase() === needle);
    setFilters((previous) => ({
      ...previous,
      location: isKnown ? city : previous.location,
      searchQuery: isKnown ? '' : previous.searchQuery,
    }));
    scrollToSection('properties-section', 0);
  }, []);

  const handleSelectCategory = useCallback((category: string) => {
    setFilters((previous) => ({ ...previous, category }));
  }, []);

  const handleToggleFavorite = useCallback((propertyId: string) => {
    setFavorites((previous) =>
      previous.includes(propertyId)
        ? previous.filter((id) => id !== propertyId)
        : [...previous, propertyId],
    );
  }, []);

  const requireAuth = useCallback((action: () => void) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    action();
  }, [user]);

  const handleOpenAddProperty = useCallback(() => {
    requireAuth(() => {
      setPropertyToEdit(null);
      setShowAddEditModal(true);
    });
  }, [requireAuth]);

  const handleOpenEditProperty = useCallback(
    (property: Property) => {
      requireAuth(() => {
        setPropertyToEdit(property);
        setShowAddEditModal(true);
      });
    },
    [requireAuth],
  );

  const handleDeleteProperty = useCallback(
    async (property: Property) => {
      if (!user || property.ownerId !== user.uid) return;
      if (!window.confirm(`Delete “${property.title}”? This cannot be undone.`)) return;
      try {
        await deleteProperty(property.id);
        setProperties((previous) => previous.filter((item) => item.id !== property.id));
        setSelectedProperty((current) => (current?.id === property.id ? null : current));
      } catch (error) {
        console.error('Error deleting property:', error);
        window.alert('Could not delete the listing. Please try again.');
      }
    },
    [user],
  );

  const handlePropertySaved = useCallback((saved: Property, isEdit: boolean) => {
    setProperties((previous) =>
      isEdit
        ? previous.map((item) => (item.id === saved.id ? saved : item))
        : [saved, ...previous],
    );
    setSelectedProperty((current) => (current?.id === saved.id ? saved : current));
    setShowAddEditModal(false);
    setPropertyToEdit(null);
  }, []);

  const handleOpenBookViewing = useCallback(
    (property: Property) => {
      requireAuth(() => setBookingProperty(property));
    },
    [requireAuth],
  );

  const handleOpenDashboard = useCallback(
    (tab: DashboardTab = 'listings') => {
      requireAuth(() => {
        setDashboardTab(tab);
        setShowDashboardModal(true);
      });
    },
    [requireAuth],
  );

  /* ---------------- Render ---------------- */

  return (
    <>
      <AnimatePresence>
        {!appReady && <Preloader onComplete={handlePreloaderComplete} />}
      </AnimatePresence>

      <CursorGlow />

      <div className="flex min-h-[100svh] flex-col bg-bone-50 text-ink-900">
        <Navbar
          onOpenAuth={() => setShowAuthModal(true)}
          onOpenAddProperty={handleOpenAddProperty}
          onOpenDashboard={handleOpenDashboard}
          onSelectCategory={handleSelectCategory}
          onSelectLocation={handleSelectLocation}
          onScrollToSection={handleScrollToSection}
          favoritesCount={favorites.length}
          onOpenFavorites={() => handleOpenDashboard('favorites')}
        />

        <main className="flex-grow">
          <HeroSection
            filters={filters}
            onFilterChange={handleFilterChange}
            onSearch={() => scrollToSection('properties-section')}
            onExploreClick={() => scrollToSection('properties-section')}
            onLearnMoreClick={() => scrollToSection('about-section')}
            locationsList={locationsList}
          />

          <TrustBadges />

          <PropertyMarquee
            properties={properties}
            favorites={favorites}
            onSelectProperty={setSelectedProperty}
            onBookViewing={handleOpenBookViewing}
            onEditProperty={handleOpenEditProperty}
            onDeleteProperty={handleDeleteProperty}
            onToggleFavorite={handleToggleFavorite}
          />

          <FeaturedProperties
            properties={filteredProperties}
            loading={loading}
            filters={filters}
            onFilterChange={handleFilterChange}
            onSelectProperty={setSelectedProperty}
            onBookViewing={handleOpenBookViewing}
            onEditProperty={handleOpenEditProperty}
            onDeleteProperty={handleDeleteProperty}
            onOpenAddProperty={handleOpenAddProperty}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onResetFilters={handleResetFilters}
          />

          <StatsCounter />

          <ArchitectureVisualizer />

          <HorizontalStory onSelectLocation={handleSelectLocation} />

          <AboutSection onLearnMore={() => scrollToSection('contact-section')} />

          <ServicesSection
            onSelectCategory={(category) => {
              handleSelectCategory(category);
              scrollToSection('properties-section');
            }}
            onOpenAddProperty={handleOpenAddProperty}
          />

          <TestimonialsSection />

          <ContactSection />
        </main>

        <Footer
          onScrollToSection={handleScrollToSection}
          onSelectCategory={handleSelectCategory}
          onSelectLocation={handleSelectLocation}
        />
      </div>

      {/* ==================== Overlays ==================== */}

      {selectedProperty && (
        <PropertyDetailsModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          onBookViewing={handleOpenBookViewing}
          onEditProperty={handleOpenEditProperty}
          onDeleteProperty={handleDeleteProperty}
          isFavorite={favorites.includes(selectedProperty.id)}
          onToggleFavorite={handleToggleFavorite}
        />
      )}

      {bookingProperty && (
        <BookViewingModal
          property={bookingProperty}
          onClose={() => setBookingProperty(null)}
          onOpenAuth={() => setShowAuthModal(true)}
          onViewingBooked={(_viewing: Viewing) => {
            /* Booking confirmed — dashboard reflects it on next open. */
          }}
        />
      )}

      {showAddEditModal && (
        <AddEditPropertyModal
          propertyToEdit={propertyToEdit}
          onClose={() => {
            setShowAddEditModal(false);
            setPropertyToEdit(null);
          }}
          onOpenAuth={() => setShowAuthModal(true)}
          onSuccess={handlePropertySaved}
        />
      )}

      {showDashboardModal && user && (
        <UserDashboardModal
          initialTab={dashboardTab}
          properties={properties}
          favorites={favorites}
          onClose={() => setShowDashboardModal(false)}
          onSelectProperty={setSelectedProperty}
          onEditProperty={handleOpenEditProperty}
          onDeleteProperty={handleDeleteProperty}
          onOpenAddProperty={handleOpenAddProperty}
          onToggleFavorite={handleToggleFavorite}
        />
      )}

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
