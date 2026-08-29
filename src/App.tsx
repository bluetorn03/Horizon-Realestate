import React, { useState, useEffect, useMemo } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { TrustBadges } from './components/TrustBadges';
import { FeaturedProperties } from './components/FeaturedProperties';
import { StatsCounter } from './components/StatsCounter';
import { AboutSection } from './components/AboutSection';
import { ServicesSection } from './components/ServicesSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';

import { PropertyDetailsModal } from './components/PropertyDetailsModal';
import { BookViewingModal } from './components/BookViewingModal';
import { AddEditPropertyModal } from './components/AddEditPropertyModal';
import { UserDashboardModal } from './components/UserDashboardModal';
import { AuthModal } from './components/AuthModal';

import type { Property, PropertyFilterState, Viewing } from './types';
import { fetchAllProperties, deleteProperty } from './lib/firebase';

function MainApp() {
  const { user } = useAuth();

  // Properties state
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [filters, setFilters] = useState<PropertyFilterState>({
    searchQuery: '',
    category: 'All',
    listingType: 'All',
    location: '',
    minPrice: 0,
    maxPrice: 100000000,
    minBedrooms: 0,
    sortBy: 'recommended',
  });

  // Favorites state (persisted locally & synced)
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('horizon_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modals state
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [bookingProperty, setBookingProperty] = useState<Property | null>(null);
  const [propertyToEdit, setPropertyToEdit] = useState<Property | null>(null);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDashboardModal, setShowDashboardModal] = useState(false);
  const [dashboardTab, setDashboardTab] = useState<'listings' | 'viewings' | 'inquiries' | 'favorites'>('listings');

  // Load properties from Firestore on mount
  const loadProperties = async () => {
    setLoading(true);
    try {
      const data = await fetchAllProperties();
      setProperties(data);
    } catch (err) {
      console.error('Failed to load properties:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('horizon_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed saving favorites to localStorage:', e);
    }
  }, [favorites]);

  const handleToggleFavorite = (propertyId: string) => {
    setFavorites((prev) =>
      prev.includes(propertyId) ? prev.filter((id) => id !== propertyId) : [...prev, propertyId]
    );
  };

  // Distinct locations list for hero search dropdown
  const locationsList = useMemo(() => {
    const locSet = new Set<string>();
    properties.forEach((p) => {
      if (p.location) locSet.add(p.location);
      else if (p.city) locSet.add(p.city);
    });
    return Array.from(locSet);
  }, [properties]);

  // Filtered & Sorted properties
  const filteredProperties = useMemo(() => {
    return properties
      .filter((p) => {
        // 1. Search Query
        if (filters.searchQuery.trim()) {
          const query = filters.searchQuery.toLowerCase();
          const matchTitle = p.title.toLowerCase().includes(query);
          const matchDesc = p.description.toLowerCase().includes(query);
          const matchLoc = (p.location || '').toLowerCase().includes(query);
          const matchCity = (p.city || '').toLowerCase().includes(query);
          const matchAddress = (p.address || '').toLowerCase().includes(query);
          const matchCategory = p.category.toLowerCase().includes(query);
          const matchAmenities = (p.amenities || []).some((a) => a.toLowerCase().includes(query));
          if (!matchTitle && !matchDesc && !matchLoc && !matchCity && !matchAddress && !matchCategory && !matchAmenities) {
            return false;
          }
        }

        // 2. Category
        if (filters.category !== 'All') {
          if (p.category.toLowerCase() !== filters.category.toLowerCase()) {
            // Check alias for House / Villa
            if (filters.category === 'House' && p.category === 'Villa') {
              // allow
            } else {
              return false;
            }
          }
        }

        // 3. Listing Type
        if (filters.listingType !== 'All') {
          if (p.listingType.toLowerCase() !== filters.listingType.toLowerCase()) {
            return false;
          }
        }

        // 4. Location
        if (filters.location) {
          const locFilter = filters.location.toLowerCase();
          const propLoc = (p.location || p.city || '').toLowerCase();
          if (!propLoc.includes(locFilter)) {
            return false;
          }
        }

        // 5. Min Price
        if (filters.minPrice > 0 && p.price < filters.minPrice) {
          return false;
        }

        // 6. Max Price
        if (filters.maxPrice < 100000000 && p.price > filters.maxPrice) {
          return false;
        }

        // 7. Bedrooms
        if (filters.minBedrooms > 0 && p.bedrooms < filters.minBedrooms) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'price-asc') {
          return a.price - b.price;
        }
        if (filters.sortBy === 'price-desc') {
          return b.price - a.price;
        }
        if (filters.sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        // Recommended: Featured first, then newest
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [properties, filters]);

  const handleFilterChange = (newFilters: Partial<PropertyFilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      category: 'All',
      listingType: 'All',
      location: '',
      minPrice: 0,
      maxPrice: 100000000,
      minBedrooms: 0,
      sortBy: 'recommended',
    });
  };

  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Property Actions
  const handleOpenAddProperty = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setPropertyToEdit(null);
    setShowAddEditModal(true);
  };

  const handleOpenEditProperty = (prop: Property) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setPropertyToEdit(prop);
    setShowAddEditModal(true);
  };

  const handleDeleteProperty = async (prop: Property) => {
    if (!user || prop.ownerId !== user.uid) return;
    if (window.confirm(`Are you sure you want to delete "${prop.title}"? This action cannot be undone.`)) {
      try {
        await deleteProperty(prop.id);
        setProperties((prev) => prev.filter((p) => p.id !== prop.id));
        if (selectedProperty?.id === prop.id) {
          setSelectedProperty(null);
        }
      } catch (err) {
        console.error('Error deleting property:', err);
        alert('Failed to delete property listing. Please try again.');
      }
    }
  };

  const handlePropertySaved = (savedProp: Property, isEdit: boolean) => {
    if (isEdit) {
      setProperties((prev) => prev.map((p) => (p.id === savedProp.id ? savedProp : p)));
      if (selectedProperty?.id === savedProp.id) {
        setSelectedProperty(savedProp);
      }
    } else {
      setProperties((prev) => [savedProp, ...prev]);
    }
    setShowAddEditModal(false);
  };

  const handleOpenBookViewing = (prop: Property) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setBookingProperty(prop);
  };

  const handleOpenDashboard = (tab: 'listings' | 'viewings' | 'inquiries' | 'favorites' = 'listings') => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setDashboardTab(tab);
    setShowDashboardModal(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-slate-900 font-sans">
      {/* 1. Header & Navigation */}
      <Navbar
        onOpenAuth={() => setShowAuthModal(true)}
        onOpenAddProperty={handleOpenAddProperty}
        onOpenDashboard={handleOpenDashboard}
        onSelectCategory={(cat) => handleFilterChange({ category: cat })}
        onScrollToSection={handleScrollToSection}
        favoritesCount={favorites.length}
        onOpenFavorites={() => handleOpenDashboard('favorites')}
      />

      <main className="flex-grow">
        {/* 2. Hero Section matching reference design */}
        <HeroSection
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearch={() => handleScrollToSection('properties-section')}
          onExploreClick={() => handleScrollToSection('properties-section')}
          onLearnMoreClick={() => handleScrollToSection('about-section')}
          locationsList={locationsList}
        />

        {/* 3. 4 Trust Badges Strip matching reference */}
        <TrustBadges />

        {/* 4. Featured Properties Grid matching reference 4-card row layout */}
        <FeaturedProperties
          properties={filteredProperties}
          loading={loading}
          filters={filters}
          onFilterChange={handleFilterChange}
          onSelectProperty={(prop) => setSelectedProperty(prop)}
          onBookViewing={handleOpenBookViewing}
          onEditProperty={handleOpenEditProperty}
          onDeleteProperty={handleDeleteProperty}
          onOpenAddProperty={handleOpenAddProperty}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          onResetFilters={handleResetFilters}
        />

        {/* 5. Counter Stats Strip matching reference dark navy bar */}
        <StatsCounter />

        {/* 6. About Us Section matching reference video & narrative */}
        <AboutSection
          onLearnMore={() => handleScrollToSection('contact-section')}
        />

        {/* 7. Real Estate Solutions & Services */}
        <ServicesSection
          onSelectCategory={(cat) => {
            handleFilterChange({ category: cat });
            handleScrollToSection('properties-section');
          }}
          onOpenAddProperty={handleOpenAddProperty}
        />

        {/* 8. Client Testimonials matching reference layout */}
        <TestimonialsSection />

        {/* 9. Private Advisory & Contact Section */}
        <ContactSection />
      </main>

      {/* 10. Dark Luxury Footer matching reference design */}
      <Footer
        onScrollToSection={handleScrollToSection}
        onSelectCategory={(cat) => handleFilterChange({ category: cat })}
      />

      {/* ================= MODALS ================= */}

      {/* Dedicated Property Details Modal */}
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

      {/* Book Private Viewing Modal */}
      {bookingProperty && (
        <BookViewingModal
          property={bookingProperty}
          onClose={() => setBookingProperty(null)}
          onOpenAuth={() => setShowAuthModal(true)}
          onViewingBooked={(viewing: Viewing) => {
            // viewing confirmed
          }}
        />
      )}

      {/* Add / Edit Property Modal */}
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

      {/* Member Management Dashboard Modal */}
      {showDashboardModal && user && (
        <UserDashboardModal
          initialTab={dashboardTab}
          properties={properties}
          favorites={favorites}
          onClose={() => setShowDashboardModal(false)}
          onSelectProperty={(prop) => {
            setSelectedProperty(prop);
            setShowDashboardModal(false);
          }}
          onEditProperty={(prop) => {
            setShowDashboardModal(false);
            handleOpenEditProperty(prop);
          }}
          onDeleteProperty={handleDeleteProperty}
          onOpenAddProperty={() => {
            setShowDashboardModal(false);
            handleOpenAddProperty();
          }}
          onToggleFavorite={handleToggleFavorite}
        />
      )}

      {/* Authentication Modal */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
