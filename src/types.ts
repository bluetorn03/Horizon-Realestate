export type ListingType = 'sale' | 'rent' | 'commercial';

export type PropertyCategory = 'House' | 'Apartment' | 'Plot' | 'Villa' | 'Commercial';

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  listingType: ListingType;
  category: PropertyCategory;
  location: string;
  address: string;
  city: string;
  state?: string;
  zipCode?: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  lotSize?: string;
  yearBuilt?: number;
  garage?: number;
  images: string[];
  featured?: boolean;
  amenities: string[];
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone?: string;
  ownerPhoto?: string;
  createdAt: string;
  updatedAt?: string;
  /** Catalog generation marker — used to retire the original USD demo listings. */
  catalogVersion?: number;
}

export type ViewingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Viewing {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyLocation: string;
  propertyImage: string;
  propertyPrice: number;
  propertyOwnerId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  date: string;
  timeSlot: string;
  notes?: string;
  status: ViewingStatus;
  createdAt: string;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  phone?: string;
  role?: 'user' | 'agent' | 'admin';
}

export interface PropertyFilterState {
  searchQuery: string;
  category: string; // 'All' | PropertyCategory
  listingType: string; // 'All' | ListingType
  location: string;
  minPrice: number;
  maxPrice: number;
  minBedrooms: number;
  sortBy: 'recommended' | 'price-asc' | 'price-desc' | 'newest';
}
