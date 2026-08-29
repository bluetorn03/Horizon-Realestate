import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updateProfile,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import type { Property, Viewing } from '../types';
import firebaseConfigData from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: firebaseConfigData.apiKey,
  authDomain: firebaseConfigData.authDomain,
  projectId: firebaseConfigData.projectId,
  storageBucket: firebaseConfigData.storageBucket,
  messagingSenderId: firebaseConfigData.messagingSenderId,
  appId: firebaseConfigData.appId,
};

// Initialize Firebase App instance safely
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Initialize Firestore using specified database ID if available
export const db = getFirestore(app, firebaseConfigData.firestoreDatabaseId || undefined);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Curated initial seed properties for first-time launch matching reference image and diverse property categories
export const INITIAL_PROPERTIES: Omit<Property, 'id'>[] = [
  {
    title: 'Modern Family Home',
    description: 'Impeccably designed architectural masterpiece located in a prestigious Beverly Hills enclave. Features an expansive open floor plan, soaring ceilings, double-height floor-to-ceiling windows, custom Italian chef kitchen with Sub-Zero & Miele appliances, private heated infinity pool, manicured private yard, and integrated smart home automation.',
    price: 2850000,
    listingType: 'sale',
    category: 'House',
    location: 'Beverly Hills, California',
    address: '742 Evergreen Crest Way',
    city: 'Beverly Hills',
    state: 'CA',
    zipCode: '90210',
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2500,
    lotSize: '0.45 Acres',
    yearBuilt: 2022,
    garage: 2,
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=80'
    ],
    featured: true,
    amenities: ['Private Pool', 'Smart Home System', 'Chef Kitchen', 'Wine Cellar', '2-Car Garage', 'Central AC & Heating', 'Security System', 'Outdoor Firepit'],
    ownerId: 'system_admin',
    ownerName: 'Alexander Hayes',
    ownerEmail: 'alexander@horizonestates.com',
    ownerPhone: '+1 (212) 555-7890',
    ownerPhoto: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80',
    createdAt: new Date().toISOString()
  },
  {
    title: 'Luxury Penthouse Apartment',
    description: 'Breathtaking corner penthouse offering panoramic Central Park and skyline views. Floor-to-ceiling glass wrapping all living areas, private wrap-around terrace, custom marble countertops, spa-inspired primary ensuite with soaking tub, 24/7 concierge service, private elevator access, and rooftop wellness club.',
    price: 4200, // $4,200 / Month
    listingType: 'rent',
    category: 'Apartment',
    location: 'Manhattan, New York',
    address: '432 Park Avenue, Suite 62B',
    city: 'Manhattan',
    state: 'NY',
    zipCode: '10022',
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1200,
    yearBuilt: 2021,
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1400&q=80'
    ],
    featured: true,
    amenities: ['Skyline Views', 'Private Elevator', '24/7 Concierge', 'Balcony / Terrace', 'Fitness Center', 'Valet Parking', 'High-Speed Fiber', 'Pet Friendly'],
    ownerId: 'system_admin',
    ownerName: 'Elena Rostova',
    ownerEmail: 'elena@horizonestates.com',
    ownerPhone: '+1 (212) 555-7891',
    ownerPhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    createdAt: new Date().toISOString()
  },
  {
    title: 'Oceanview Villa',
    description: 'Spectacular waterfront sanctuary nestled in sunny Miami Beach with private yacht dockage. Features 5 ultra-luxurious en-suite bedrooms, dual custom kitchens, resort-style infinity pool cascading into the canal, private cabana with outdoor bar, cinema room, and private gated security.',
    price: 6750000,
    listingType: 'sale',
    category: 'Villa',
    location: 'Miami, Florida',
    address: '18 Ocean Drive Boulevard',
    city: 'Miami',
    state: 'FL',
    zipCode: '33139',
    bedrooms: 5,
    bathrooms: 6,
    sqft: 4500,
    lotSize: '0.8 Acres',
    yearBuilt: 2023,
    garage: 3,
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1400&q=80'
    ],
    featured: true,
    amenities: ['Waterfront & Dock', 'Infinity Pool', 'Private Cabana', 'Home Theater', '3-Car Garage', 'Smart Security', 'Outdoor Kitchen', 'Wine Tasting Room'],
    ownerId: 'system_admin',
    ownerName: 'Marcus Sterling',
    ownerEmail: 'marcus@horizonestates.com',
    ownerPhone: '+1 (305) 555-4321',
    ownerPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    createdAt: new Date().toISOString()
  },
  {
    title: 'Luxury Commercial Office Space',
    description: 'Class-A modern commercial headquarters in the heart of San Francisco Financial District. Turnkey executive suites, high-tech conference pods, panoramic bay views, private server room, LEED Platinum certified infrastructure, and secure underground reserved parking.',
    price: 1950000,
    listingType: 'commercial',
    category: 'Commercial',
    location: 'San Francisco, California',
    address: '555 California Street, 18th Floor',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94104',
    bedrooms: 0,
    bathrooms: 2,
    sqft: 3000,
    yearBuilt: 2020,
    garage: 4,
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=80'
    ],
    featured: true,
    amenities: ['High-Speed Fiber', 'Conference Suites', '24/7 Security Access', 'Reserved Parking', 'Server Room', 'Kitchenette / Lounge', 'HVAC Dual Zone'],
    ownerId: 'system_admin',
    ownerName: 'Sophia Vance',
    ownerEmail: 'sophia@horizonestates.com',
    ownerPhone: '+1 (415) 555-9012',
    ownerPhoto: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80',
    createdAt: new Date().toISOString()
  },
  {
    title: 'Scenic Hillside Residential Plot',
    description: 'Rare opportunity to acquire a prime, fully entitled 1.2-acre residential development plot in Aspen. Spectacular 360-degree mountain vistas, all utilities pre-connected to the property boundary, approved architectural blueprints for a 6,000 sq ft contemporary chalet, and private gated access road.',
    price: 1250000,
    listingType: 'sale',
    category: 'Plot',
    location: 'Aspen, Colorado',
    address: '102 Red Mountain Ridge Rd',
    city: 'Aspen',
    state: 'CO',
    zipCode: '81611',
    bedrooms: 0,
    bathrooms: 0,
    sqft: 52272, // 1.2 acres in sqft
    lotSize: '1.2 Acres',
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1400&q=80'
    ],
    featured: false,
    amenities: ['Mountain Views', 'Utilities Connected', 'Approved Building Plans', 'Gated Access', 'Cleared Building Pad', 'Geotechnical Survey Complete'],
    ownerId: 'system_admin',
    ownerName: 'Alexander Hayes',
    ownerEmail: 'alexander@horizonestates.com',
    ownerPhone: '+1 (212) 555-7890',
    ownerPhoto: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80',
    createdAt: new Date().toISOString()
  },
  {
    title: 'Coastal Sunset Estate Plot',
    description: 'Premier cliffside parcel in Malibu offering unobstructed Pacific Ocean horizon views. Direct private beach trail access, zoning approved for custom luxury coastal residence with infinity pool, soils tested and ready for immediate architectural design.',
    price: 3400000,
    listingType: 'sale',
    category: 'Plot',
    location: 'Malibu, California',
    address: '32400 Pacific Coast Highway',
    city: 'Malibu',
    state: 'CA',
    zipCode: '90265',
    bedrooms: 0,
    bathrooms: 0,
    sqft: 87120, // 2 acres
    lotSize: '2.0 Acres',
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80'
    ],
    featured: false,
    amenities: ['Unobstructed Ocean View', 'Beach Access Trail', 'Zoned for Luxury Estate', 'Survey Completed', 'Water & Power At Site'],
    ownerId: 'system_admin',
    ownerName: 'Marcus Sterling',
    ownerEmail: 'marcus@horizonestates.com',
    ownerPhone: '+1 (305) 555-4321',
    ownerPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    createdAt: new Date().toISOString()
  },
  {
    title: 'Modern Minimalist Villa',
    description: 'Award-winning contemporary glass-and-concrete architectural masterpiece. Cantilevered terraces, minimalist Japanese rock garden, heated saltwater lap pool, geothermal climate control, and integrated art gallery lighting throughout.',
    price: 4950000,
    listingType: 'sale',
    category: 'Villa',
    location: 'Austin, Texas',
    address: '2200 Barton Creek Trail',
    city: 'Austin',
    state: 'TX',
    zipCode: '78735',
    bedrooms: 4,
    bathrooms: 5,
    sqft: 4100,
    lotSize: '0.65 Acres',
    yearBuilt: 2023,
    garage: 3,
    images: [
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1400&q=80'
    ],
    featured: false,
    amenities: ['Saltwater Pool', 'Zen Garden', 'Smart Security', 'Wine Cellar', 'Solar Array', 'Automated Blinds', 'EV Charger'],
    ownerId: 'system_admin',
    ownerName: 'Elena Rostova',
    ownerEmail: 'elena@horizonestates.com',
    ownerPhone: '+1 (212) 555-7891',
    ownerPhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    createdAt: new Date().toISOString()
  },
  {
    title: 'Downtown Skyline Penthouse',
    description: 'Designer 3-bedroom luxury flat in premier high-rise tower. Featuring 11-foot ceilings, bespoke walnut cabinetry, motorized sheer drapery, private balcony overlooking the marina, resident rooftop lounge, and 24-hour valet parking.',
    price: 6500, // $6,500 / Month
    listingType: 'rent',
    category: 'Apartment',
    location: 'Seattle, Washington',
    address: '1900 1st Avenue, Penthouse 4',
    city: 'Seattle',
    state: 'WA',
    zipCode: '98101',
    bedrooms: 3,
    bathrooms: 3,
    sqft: 1850,
    yearBuilt: 2022,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1502005229762-ee15247494dd?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1400&q=80'
    ],
    featured: false,
    amenities: ['Marina Views', 'Private Balcony', '24/7 Concierge', 'Rooftop Lounge', 'Fitness Studio', 'Pet Spa', 'Underground Parking'],
    ownerId: 'system_admin',
    ownerName: 'Alexander Hayes',
    ownerEmail: 'alexander@horizonestates.com',
    ownerPhone: '+1 (212) 555-7890',
    ownerPhoto: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80',
    createdAt: new Date().toISOString()
  }
];

// Seed Firestore with initial properties if the collection is empty
export async function seedPropertiesIfEmpty(): Promise<Property[]> {
  try {
    const propsCol = collection(db, 'properties');
    const snapshot = await getDocs(propsCol);
    
    if (!snapshot.empty) {
      const properties: Property[] = [];
      snapshot.forEach(docSnap => {
        properties.push({ id: docSnap.id, ...docSnap.data() } as Property);
      });
      return properties;
    }

    // Seed batch
    console.log('Seeding initial properties to Firestore...');
    const seededProperties: Property[] = [];
    const batch = writeBatch(db);

    for (const item of INITIAL_PROPERTIES) {
      const docRef = doc(propsCol);
      const newProp: Property = {
        ...item,
        id: docRef.id,
        createdAt: new Date().toISOString()
      };
      batch.set(docRef, newProp);
      seededProperties.push(newProp);
    }

    await batch.commit();
    console.log(`Seeded ${seededProperties.length} properties to Firestore.`);
    return seededProperties;
  } catch (error) {
    console.error('Error in seedPropertiesIfEmpty:', error);
    // Return initial list as fallback so UI remains functional
    return INITIAL_PROPERTIES.map((p, idx) => ({ ...p, id: `seed-${idx}` }));
  }
}

// Fetch all properties from Firestore
export async function fetchAllProperties(): Promise<Property[]> {
  try {
    const propsCol = collection(db, 'properties');
    const snapshot = await getDocs(propsCol);
    if (snapshot.empty) {
      return await seedPropertiesIfEmpty();
    }
    const properties: Property[] = [];
    snapshot.forEach(docSnap => {
      properties.push({ id: docSnap.id, ...docSnap.data() } as Property);
    });
    // Sort by createdAt descending
    return properties.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error('Error fetching properties from Firestore:', error);
    return seedPropertiesIfEmpty();
  }
}

// Fetch a single property
export async function fetchPropertyById(id: string): Promise<Property | null> {
  try {
    const docRef = doc(db, 'properties', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Property;
    }
    return null;
  } catch (error) {
    console.error('Error fetching property by ID:', error);
    return null;
  }
}

// Create a new property listing
export async function createProperty(propertyData: Omit<Property, 'id' | 'createdAt'>): Promise<Property> {
  const propsCol = collection(db, 'properties');
  const now = new Date().toISOString();
  try {
    const docRef = await addDoc(propsCol, {
      ...propertyData,
      createdAt: now,
      updatedAt: now
    });
    
    return {
      ...propertyData,
      id: docRef.id,
      createdAt: now,
      updatedAt: now
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'properties');
  }
}

// Update existing property
export async function updateProperty(id: string, propertyData: Partial<Property>): Promise<void> {
  try {
    const docRef = doc(db, 'properties', id);
    await updateDoc(docRef, {
      ...propertyData,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `properties/${id}`);
  }
}

// Delete a property
export async function deleteProperty(id: string): Promise<void> {
  try {
    const docRef = doc(db, 'properties', id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `properties/${id}`);
  }
}

// ================= VIEWINGS / APPOINTMENTS ================= //

// Book a viewing appointment
export async function bookViewing(viewingData: Omit<Viewing, 'id' | 'createdAt' | 'status'>): Promise<Viewing> {
  const viewingsCol = collection(db, 'viewings');
  const now = new Date().toISOString();
  const newViewing = {
    ...viewingData,
    status: 'pending' as const,
    createdAt: now
  };
  try {
    const docRef = await addDoc(viewingsCol, newViewing);
    return {
      ...newViewing,
      id: docRef.id
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'viewings');
  }
}

// Fetch viewings booked by a user
export async function fetchUserViewings(userId: string): Promise<Viewing[]> {
  try {
    const viewingsCol = collection(db, 'viewings');
    const q = query(viewingsCol, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    const list: Viewing[] = [];
    snapshot.forEach(docSnap => {
      list.push({ id: docSnap.id, ...docSnap.data() } as Viewing);
    });
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error('Error fetching user viewings:', error);
    return [];
  }
}

// Fetch viewings requested on user's own listed properties
export async function fetchOwnerViewings(ownerId: string): Promise<Viewing[]> {
  try {
    const viewingsCol = collection(db, 'viewings');
    const q = query(viewingsCol, where('propertyOwnerId', '==', ownerId));
    const snapshot = await getDocs(q);
    const list: Viewing[] = [];
    snapshot.forEach(docSnap => {
      list.push({ id: docSnap.id, ...docSnap.data() } as Viewing);
    });
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error('Error fetching owner viewings:', error);
    return [];
  }
}

// Update viewing status (e.g. confirm, cancel)
export async function updateViewingStatus(viewingId: string, status: Viewing['status']): Promise<void> {
  try {
    const docRef = doc(db, 'viewings', viewingId);
    await updateDoc(docRef, { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `viewings/${viewingId}`);
  }
}

// Delete / Cancel viewing
export async function deleteViewing(viewingId: string): Promise<void> {
  try {
    const docRef = doc(db, 'viewings', viewingId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `viewings/${viewingId}`);
  }
}
