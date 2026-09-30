import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Property, PropertyFilterState } from '../types';
import { fetchAllProperties, deleteProperty } from '../lib/firebase';
import { MAX_PRICE_FILTER } from '../lib/format';
import { useAuth } from './AuthContext';
import { BookViewingModal } from '../components/BookViewingModal';
import { AddEditPropertyModal } from '../components/AddEditPropertyModal';
import { UserDashboardModal } from '../components/UserDashboardModal';
import { AuthModal } from '../components/AuthModal';

export type DashboardTab = 'listings' | 'viewings' | 'inquiries' | 'favorites';

const DEFAULT_FILTERS: PropertyFilterState = {
  searchQuery: '',
  category: 'All',
  listingType: 'All',
  location: '',
  minPrice: 0,
  maxPrice: MAX_PRICE_FILTER,
  minBedrooms: 0,
  sortBy: 'recommended',
};

interface SiteContextValue {
  properties: Property[];
  loading: boolean;
  favorites: string[];
  filters: PropertyFilterState;
  filteredProperties: Property[];
  locationsList: string[];
  isFavorite: (propertyId: string) => boolean;
  toggleFavorite: (propertyId: string) => void;
  handleFilterChange: (filters: Partial<PropertyFilterState>) => void;
  resetFilters: () => void;
  openBookViewing: (property: Property) => void;
  openAddProperty: () => void;
  openEditProperty: (property: Property) => void;
  removeProperty: (property: Property) => void;
  openAuth: () => void;
  openDashboard: (tab?: DashboardTab) => void;
  viewProperty: (property: Property) => void;
}

const SiteContext = createContext<SiteContextValue | undefined>(undefined);

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<PropertyFilterState>(DEFAULT_FILTERS);

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('horizon_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modal state
  const [bookingProperty, setBookingProperty] = useState<Property | null>(null);
  const [propertyToEdit, setPropertyToEdit] = useState<Property | null>(null);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDashboardModal, setShowDashboardModal] = useState(false);
  const [dashboardTab, setDashboardTab] = useState<DashboardTab>('listings');

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

  useEffect(() => {
    try {
      localStorage.setItem('horizon_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed saving favorites to localStorage:', e);
    }
  }, [favorites]);

  const locationsList = useMemo(() => {
    const locSet = new Set<string>();
    properties.forEach((p) => {
      if (p.location) locSet.add(p.location);
      else if (p.city) locSet.add(p.city);
    });
    return Array.from(locSet).sort();
  }, [properties]);

  const filteredProperties = useMemo(() => {
    return properties
      .filter((p) => {
        if (filters.searchQuery.trim()) {
          const query = filters.searchQuery.toLowerCase();
          const matches = [
            p.title,
            p.description,
            p.location || '',
            p.city || '',
            p.address || '',
            p.category,
            ...(p.amenities || []),
          ].some((field) => field.toLowerCase().includes(query));
          if (!matches) return false;
        }

        if (filters.category !== 'All') {
          const cat = filters.category.toLowerCase();
          if (p.category.toLowerCase() !== cat) {
            if (!(filters.category === 'House' && p.category === 'Villa')) return false;
          }
        }

        if (filters.listingType !== 'All' && p.listingType.toLowerCase() !== filters.listingType.toLowerCase()) {
          return false;
        }

        if (filters.location) {
          const propLoc = (p.location || p.city || '').toLowerCase();
          if (!propLoc.includes(filters.location.toLowerCase())) return false;
        }

        if (filters.minPrice > 0 && p.price < filters.minPrice) return false;
        if (filters.maxPrice < MAX_PRICE_FILTER && p.price > filters.maxPrice) return false;
        if (filters.minBedrooms > 0 && p.bedrooms < filters.minBedrooms) return false;

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'price-asc') return a.price - b.price;
        if (filters.sortBy === 'price-desc') return b.price - a.price;
        if (filters.sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [properties, filters]);

  const handleFilterChange = (newFilters: Partial<PropertyFilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  const toggleFavorite = (propertyId: string) => {
    setFavorites((prev) =>
      prev.includes(propertyId) ? prev.filter((id) => id !== propertyId) : [...prev, propertyId]
    );
  };

  const isFavorite = (propertyId: string) => favorites.includes(propertyId);

  const viewProperty = (property: Property) => {
    setShowDashboardModal(false);
    navigate(`/properties/${property.id}`);
  };

  const openBookViewing = (property: Property) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setBookingProperty(property);
  };

  const openAddProperty = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setPropertyToEdit(null);
    setShowAddEditModal(true);
  };

  const openEditProperty = (property: Property) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setPropertyToEdit(property);
    setShowAddEditModal(true);
  };

  const removeProperty = async (property: Property) => {
    if (!user || property.ownerId !== user.uid) return;
    if (!window.confirm(`Are you sure you want to delete "${property.title}"? This action cannot be undone.`)) {
      return;
    }
    try {
      await deleteProperty(property.id);
      setProperties((prev) => prev.filter((p) => p.id !== property.id));
      if (window.location.pathname === `/properties/${property.id}`) {
        navigate('/properties');
      }
    } catch (err) {
      console.error('Error deleting property:', err);
      alert('Failed to delete property listing. Please try again.');
    }
  };

  const handlePropertySaved = (savedProp: Property, isEdit: boolean) => {
    if (isEdit) {
      setProperties((prev) => prev.map((p) => (p.id === savedProp.id ? savedProp : p)));
    } else {
      setProperties((prev) => [savedProp, ...prev]);
    }
    setShowAddEditModal(false);
    setPropertyToEdit(null);
  };

  const openDashboard = (tab: DashboardTab = 'listings') => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setDashboardTab(tab);
    setShowDashboardModal(true);
  };

  const value: SiteContextValue = {
    properties,
    loading,
    favorites,
    filters,
    filteredProperties,
    locationsList,
    isFavorite,
    toggleFavorite,
    handleFilterChange,
    resetFilters,
    openBookViewing,
    openAddProperty,
    openEditProperty,
    removeProperty,
    openAuth: () => setShowAuthModal(true),
    openDashboard,
    viewProperty,
  };

  return (
    <SiteContext.Provider value={value}>
      {children}

      {bookingProperty && (
        <BookViewingModal
          property={bookingProperty}
          onClose={() => setBookingProperty(null)}
          onOpenAuth={() => setShowAuthModal(true)}
          onViewingBooked={() => {}}
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
          onSelectProperty={viewProperty}
          onEditProperty={(prop) => {
            setShowDashboardModal(false);
            openEditProperty(prop);
          }}
          onDeleteProperty={removeProperty}
          onOpenAddProperty={() => {
            setShowDashboardModal(false);
            openAddProperty();
          }}
          onToggleFavorite={toggleFavorite}
        />
      )}

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </SiteContext.Provider>
  );
};

export const useSite = () => {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error('useSite must be used within a SiteProvider');
  }
  return context;
};
