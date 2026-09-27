export type ListingType = 'sale' | 'rent' | 'commercial';

export type PropertyCategory = 'House' | 'Apartment' | 'Plot' | 'Villa' | 'Commercial';

/** How the residence is handed over. */
export type FurnishingType = 'Unfurnished' | 'Semi-Furnished' | 'Furnished';

/** Construction / handover stage — a key Indian buying decision. */
export type PossessionStatus = 'Ready to Move' | 'Under Construction' | 'New Launch';

/**
 * A property listing. Monetary values are always a whole number of Indian
 * Rupees (INR); areas are in square feet.
 *
 * Fields marked optional are the India-specific additions and remain optional
 * so legacy documents in Firestore keep loading without a migration.
 */
export interface Property {
  id: string;
  title: string;
  description: string;
  /** Price in INR. For `rent` listings this is the monthly rent. */
  price: number;
  listingType: ListingType;
  category: PropertyCategory;
  /** Display location, e.g. "Bandra West, Mumbai". */
  location: string;
  address: string;
  city: string;
  state?: string;
  /** Indian PIN code. */
  zipCode?: string;
  bedrooms: number;
  bathrooms: number;
  /** Super built-up area in sq ft. */
  sqft: number;
  /** Net usable (carpet) area in sq ft. */
  carpetArea?: number;
  /** Built-up area in sq ft (excludes common areas). */
  builtUpArea?: number;
  /** Plot size, e.g. "2,400 sq ft" or "0.5 acre". */
  lotSize?: string;
  yearBuilt?: number;
  /** Covered parking slots. */
  garage?: number;
  /** Open parking slots. */
  openParking?: number;
  furnishing?: FurnishingType;
  possession?: PossessionStatus;
  /** RERA registration number, e.g. "P52100012345". */
  rera?: string;
  /** Monthly maintenance / society charges in INR. */
  maintenance?: number;
  /** Refundable security deposit in INR (rentals). */
  securityDeposit?: number;
  /** Floor number of the unit. */
  floor?: number;
  /** Total floors in the tower. */
  totalFloors?: number;
  facing?: string;
  overlooking?: string;
  balconies?: number;
  ageOfProperty?: string;
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
}

export type ViewingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Viewing {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyLocation: string;
  propertyImage: string;
  /** Price in INR at the time of booking. */
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
  /** Lower bound in INR. 0 = no minimum. */
  minPrice: number;
  /** Upper bound in INR. 0 = no maximum. */
  maxPrice: number;
  minBedrooms: number;
  /** Minimum carpet / built-up area in sq ft. */
  minArea: number;
  furnishing: string; // 'All' | FurnishingType
  possession: string; // 'All' | PossessionStatus
  reraOnly: boolean;
  sortBy: 'recommended' | 'price-asc' | 'price-desc' | 'newest' | 'area-desc' | 'rate-asc';
}

export type DashboardTab = 'listings' | 'viewings' | 'inquiries' | 'favorites';
