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
  User,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  writeBatch,
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

// Initialise the Firebase app exactly once, even under React StrictMode
// double-invocation and Fast Refresh.
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Initialise Firestore against the named database when one is configured.
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

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null,
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })),
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/* ==========================================================================
   Curated Indian inventory — seeded into Firestore on first launch.
   Prices are in INR. Areas are in square feet.
   ========================================================================== */
const OWNERS = {
  rhea: {
    ownerId: 'system_admin',
    ownerName: 'Rhea Malhotra',
    ownerEmail: 'rhea@horizonestates.in',
    ownerPhone: '+91 98200 45120',
    ownerPhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
  },
  kabir: {
    ownerId: 'system_admin',
    ownerName: 'Kabir Shetty',
    ownerEmail: 'kabir@horizonestates.in',
    ownerPhone: '+91 99300 21874',
    ownerPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
  },
  ananya: {
    ownerId: 'system_admin',
    ownerName: 'Ananya Deshpande',
    ownerEmail: 'ananya@horizonestates.in',
    ownerPhone: '+91 98201 77645',
    ownerPhoto: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80',
  },
  vikram: {
    ownerId: 'system_admin',
    ownerName: 'Vikram Iyer',
    ownerEmail: 'vikram@horizonestates.in',
    ownerPhone: '+91 98450 33091',
    ownerPhoto: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80',
  },
  meera: {
    ownerId: 'system_admin',
    ownerName: 'Meera Nair',
    ownerEmail: 'meera@horizonestates.in',
    ownerPhone: '+91 90040 61288',
    ownerPhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80',
  },
};

export const INITIAL_PROPERTIES: Omit<Property, 'id'>[] = [
  {
    title: 'Sea-Facing Residence, Worli',
    description:
      'A corner residence on the 31st floor of a redeveloped Worli tower, with uninterrupted Arabian Sea and Bandra-Worli Sea Link views. The plan is organised around a 9.2 m living hall with double-height glazing, a wet kitchen plus separate Indian kitchen, four bedrooms with walk-in wardrobes, and a servant quarter. Society amenities include a 25 m lap pool, temperature-controlled gym, squash court and three levels of covered parking. MahaRERA registered with clear title and occupancy certificate in place.',
    price: 159000000,
    listingType: 'sale',
    category: 'Apartment',
    location: 'Worli, Mumbai',
    address: 'Omkar 1973, Tower B, Worli',
    city: 'Mumbai',
    state: 'Maharashtra',
    zipCode: '400030',
    bedrooms: 4,
    bathrooms: 5,
    sqft: 3450,
    carpetArea: 2150,
    builtUpArea: 3100,
    yearBuilt: 2021,
    garage: 3,
    openParking: 1,
    furnishing: 'Semi-Furnished',
    possession: 'Ready to Move',
    rera: 'P51900012345',
    maintenance: 18400,
    floor: 31,
    totalFloors: 42,
    facing: 'West',
    overlooking: 'Arabian Sea',
    balconies: 3,
    ageOfProperty: '0–1 years',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1400&q=80',
    ],
    featured: true,
    amenities: [
      'RERA Registered',
      'Sea Facing',
      'Clubhouse',
      'Swimming Pool',
      'Covered Parking',
      'Power Backup',
      'Lift / Elevator',
      '24x7 Security',
      'Gymnasium',
      'Children’s Play Area',
      'High-Speed Fiber Internet',
      'Modular Kitchen',
    ],
    ...OWNERS.rhea,
    createdAt: new Date().toISOString(),
  },
  {
    title: 'Lake-View 3 BHK, Powai',
    description:
      'A bright three-bedroom apartment overlooking Powai Lake and the Hiranandani gardens. Cross-ventilated planning, 2.1 m ceilings, vitrified flooring throughout and a modular kitchen with chimney and hob. The society offers a clubhouse, swimming pool, gymnasium, indoor games room and ample visitor parking. Walking distance to schools and ten minutes from the Western Express Highway.',
    price: 185000,
    listingType: 'rent',
    category: 'Apartment',
    location: 'Powai, Mumbai',
    address: 'Lake Homes, Powai',
    city: 'Mumbai',
    state: 'Maharashtra',
    zipCode: '400076',
    bedrooms: 3,
    bathrooms: 3,
    sqft: 1850,
    carpetArea: 1420,
    builtUpArea: 1610,
    yearBuilt: 2016,
    garage: 2,
    furnishing: 'Semi-Furnished',
    possession: 'Ready to Move',
    rera: 'P51900045671',
    maintenance: 9600,
    securityDeposit: 1110000,
    floor: 12,
    totalFloors: 24,
    facing: 'East',
    overlooking: 'Powai Lake',
    balconies: 2,
    ageOfProperty: '5–10 years',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1400&q=80',
    ],
    featured: true,
    amenities: [
      'RERA Registered',
      'Clubhouse',
      'Swimming Pool',
      'Covered Parking',
      'Lift / Elevator',
      '24x7 Security',
      'Gymnasium',
      'Children’s Play Area',
      'Power Backup',
    ],
    ...OWNERS.kabir,
    createdAt: new Date().toISOString(),
  },
  {
    title: 'Portuguese-Era Villa, Assagao',
    description:
      'A restored Indo-Portuguese villa on a 6,500 sq ft plot in Assagao, North Goa. Original laterite walls and oyster-shell lime plaster have been retained behind a contemporary intervention — a double-height living volume, teak pivoting doors and a 14 m infinity pool facing the paddy fields. Four en-suite bedrooms, a detached studio pavilion and mature rain trees provide genuine seclusion ten minutes from Vagator beach.',
    price: 78000000,
    listingType: 'sale',
    category: 'Villa',
    location: 'Assagao, Goa',
    address: 'Socol Vaddo, Assagao',
    city: 'Goa',
    state: 'Goa',
    zipCode: '403503',
    bedrooms: 4,
    bathrooms: 5,
    sqft: 4200,
    carpetArea: 3100,
    builtUpArea: 3650,
    lotSize: '6,500 sq ft plot',
    yearBuilt: 1924,
    garage: 3,
    openParking: 2,
    furnishing: 'Furnished',
    possession: 'Ready to Move',
    rera: 'PRGO0523000142',
    maintenance: 22000,
    floor: 1,
    totalFloors: 2,
    facing: 'North-West',
    overlooking: 'Paddy Fields',
    balconies: 4,
    ageOfProperty: '20+ years',
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80',
    ],
    featured: true,
    amenities: [
      'RERA Registered',
      'Private Pool',
      'Private Terrace',
      'Covered Parking',
      'Visitor Parking',
      'Servant Quarter',
      'Pet Friendly',
      'Rain Water Harvesting',
      'Gated Township',
    ],
    ...OWNERS.meera,
    createdAt: new Date().toISOString(),
  },
  {
    title: 'Kharghar Skyline 3 BHK',
    description:
      'A well-planned three-bedroom residence in a Navi Mumbai node township, with a 12th-floor balcony overlooking the central park and golf course. The layout offers a 1,000 sq ft carpet area with two toilets in the common area, a utility balcony and a dedicated study niche. Amenities include a clubhouse, 25 m pool, amphitheatre and metro feeder connectivity from Kharghar station.',
    price: 16500000,
    listingType: 'sale',
    category: 'Apartment',
    location: 'Kharghar, Navi Mumbai',
    address: 'Sector 12, Kharghar',
    city: 'Navi Mumbai',
    state: 'Maharashtra',
    zipCode: '410210',
    bedrooms: 3,
    bathrooms: 3,
    sqft: 1240,
    carpetArea: 980,
    builtUpArea: 1090,
    yearBuilt: 2019,
    garage: 1,
    openParking: 1,
    furnishing: 'Unfurnished',
    possession: 'Ready to Move',
    rera: 'P52000018764',
    maintenance: 4200,
    floor: 12,
    totalFloors: 26,
    facing: 'North-East',
    overlooking: 'Central Park',
    balconies: 2,
    ageOfProperty: '1–5 years',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1400&q=80',
    ],
    featured: false,
    amenities: [
      'RERA Registered',
      'Clubhouse',
      'Swimming Pool',
      'Covered Parking',
      'Lift / Elevator',
      '24x7 Security',
      'Children’s Play Area',
      'Landscaped Garden',
      'Jogging Track',
      'Power Backup',
    ],
    ...OWNERS.ananya,
    createdAt: new Date().toISOString(),
  },
  {
    title: 'Ghodbunder Road Garden 2 BHK',
    description:
      'A compact two-bedroom apartment in a low-density Thane township on Ghodbbunder Road, surrounded by six acres of landscaped gardens and a 400 m walking loop. The unit faces the Yeoor Hills, receives excellent cross-light and includes a 1.8 m wide sit-out. Ideal first home or rental investment with metro line 4 under construction nearby.',
    price: 11200000,
    listingType: 'sale',
    category: 'Apartment',
    location: 'Ghodbunder Road, Thane',
    address: 'Ghodbunder Road, Thane West',
    city: 'Thane',
    state: 'Maharashtra',
    zipCode: '400607',
    bedrooms: 2,
    bathrooms: 2,
    sqft: 940,
    carpetArea: 720,
    builtUpArea: 820,
    yearBuilt: 2018,
    garage: 1,
    furnishing: 'Unfurnished',
    possession: 'Ready to Move',
    rera: 'P51700009832',
    maintenance: 3100,
    floor: 7,
    totalFloors: 18,
    facing: 'East',
    overlooking: 'Yeoor Hills',
    balconies: 1,
    ageOfProperty: '5–10 years',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1400&q=80',
    ],
    featured: false,
    amenities: [
      'RERA Registered',
      'Landscaped Garden',
      'Covered Parking',
      'Lift / Elevator',
      '24x7 Security',
      'Children’s Play Area',
      'Jogging Track',
      'Power Backup',
      'Rain Water Harvesting',
    ],
    ...OWNERS.ananya,
    createdAt: new Date().toISOString(),
  },
  {
    title: 'Koregaon Park Heritage Bungalow',
    description:
      'A 1940s bungalow on a 7,200 sq ft plot in Koregaon Park, thoughtfully restored behind its original façade. The plan opens onto a internal courtyard with a frangipani, a 5.5 m double-height dining volume and a north-light studio. Mature mango and jackfruit trees, a two-car garage and a separate staff block. Within walking distance of the Osho International Commune and Pune’s cafés.',
    price: 64000000,
    listingType: 'sale',
    category: 'House',
    location: 'Koregaon Park, Pune',
    address: 'North Main Road, Koregaon Park',
    city: 'Pune',
    state: 'Maharashtra',
    zipCode: '411001',
    bedrooms: 4,
    bathrooms: 4,
    sqft: 4150,
    carpetArea: 3400,
    builtUpArea: 3780,
    lotSize: '7,200 sq ft plot',
    yearBuilt: 1942,
    garage: 2,
    openParking: 2,
    furnishing: 'Unfurnished',
    possession: 'Ready to Move',
    maintenance: 12000,
    floor: 1,
    totalFloors: 2,
    facing: 'North',
    overlooking: 'Garden Courtyard',
    balconies: 2,
    ageOfProperty: '20+ years',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1502005229762-ee15247494dd?auto=format&fit=crop&w=1400&q=80',
    ],
    featured: false,
    amenities: [
      'Servant Quarter',
      'Covered Parking',
      'Landscaped Garden',
      'Vaastu Compliant',
      'Rain Water Harvesting',
      'Pet Friendly',
      'CCTV Surveillance',
      'Private Terrace',
    ],
    ...OWNERS.vikram,
    createdAt: new Date().toISOString(),
  },
  {
    title: 'Whitefield East Villa Community',
    description:
      'An end-unit villa in a 48-villa gated community off Whitefield, with a private garden, covered deck and EV charging point. The 2,600 sq ft carpet plan includes a ground-floor bedroom for elders, a family lounge on the first floor and a terrace with a covered pergola. Clubhouse, 25 m pool, gymnasium, squash court and 24x7 security within the campus.',
    price: 32500000,
    listingType: 'sale',
    category: 'Villa',
    location: 'Whitefield, Bengaluru',
    address: 'Whitefield Main Road, Bengaluru',
    city: 'Bengaluru',
    state: 'Karnataka',
    zipCode: '560066',
    bedrooms: 4,
    bathrooms: 4,
    sqft: 3300,
    carpetArea: 2600,
    builtUpArea: 2980,
    lotSize: '2,400 sq ft plot',
    yearBuilt: 2022,
    garage: 2,
    openParking: 1,
    furnishing: 'Unfurnished',
    possession: 'Ready to Move',
    rera: 'PRM/KA/RERA/1251/446/PR/220314/005812',
    maintenance: 6800,
    floor: 1,
    totalFloors: 2,
    facing: 'East',
    overlooking: 'Community Garden',
    balconies: 3,
    ageOfProperty: '0–1 years',
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1400&q=80',
    ],
    featured: false,
    amenities: [
      'RERA Registered',
      'Gated Township',
      'Clubhouse',
      'Swimming Pool',
      'Covered Parking',
      'EV Charging Point',
      'Gymnasium',
      '24x7 Security',
      'Children’s Play Area',
      'Landscaped Garden',
    ],
    ...OWNERS.kabir,
    createdAt: new Date().toISOString(),
  },
  {
    title: 'Gachibowli Financial District 3 BHK',
    description:
      'A three-bedroom residence in the Financial District with panoramic views of the Osman Sagar and the glass-tower skyline. The 1,650 sq ft carpet plan is organised around a central living court, with a 4.2 m wide master suite, walk-in wardrobe and a 240 sq ft utility balcony. Two-level clubhouse, infinity-edge pool, co-working lounge and dedicated EV bays.',
    price: 21500000,
    listingType: 'sale',
    category: 'Apartment',
    location: 'Gachibowli, Hyderabad',
    address: 'Financial District, Gachibowli',
    city: 'Hyderabad',
    state: 'Telangana',
    zipCode: '500032',
    bedrooms: 3,
    bathrooms: 3,
    sqft: 2090,
    carpetArea: 1650,
    builtUpArea: 1860,
    yearBuilt: 2023,
    garage: 2,
    furnishing: 'Unfurnished',
    possession: 'Under Construction',
    rera: 'P02400004567',
    maintenance: 5400,
    floor: 18,
    totalFloors: 34,
    facing: 'South-West',
    overlooking: 'Osman Sagar',
    balconies: 2,
    ageOfProperty: '0–1 years',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=80',
    ],
    featured: true,
    amenities: [
      'RERA Registered',
      'Clubhouse',
      'Swimming Pool',
      'Covered Parking',
      'EV Charging Point',
      'Lift / Elevator',
      '24x7 Security',
      'Gymnasium',
      'Yoga & Meditation Deck',
      'Power Backup',
      'High-Speed Fiber Internet',
    ],
    ...OWNERS.vikram,
    createdAt: new Date().toISOString(),
  },
  {
    title: 'Golf Course Road Sky Residence',
    description:
      'A four-bedroom residence on Golf Course Road, Gurugram, with a 6.4 m wide living hall opening onto a 620 sq ft terrace overlooking the golf greens. The apartment is delivered with Italian marble flooring, a temperature-controlled wine room, home theatre pre-wiring and four covered parking bays. Residents share a 40,000 sq ft clubhouse, olympic pool and business centre.',
    price: 85000000,
    listingType: 'sale',
    category: 'Apartment',
    location: 'Golf Course Road, Delhi NCR',
    address: 'Golf Course Road, Sector 54, Gurugram',
    city: 'Delhi NCR',
    state: 'Haryana',
    zipCode: '122002',
    bedrooms: 4,
    bathrooms: 5,
    sqft: 3650,
    carpetArea: 2900,
    builtUpArea: 3280,
    yearBuilt: 2020,
    garage: 4,
    openParking: 2,
    furnishing: 'Furnished',
    possession: 'Ready to Move',
    rera: 'RC/REP/HARERA/GGM/759/511/2022/47',
    maintenance: 26500,
    floor: 22,
    totalFloors: 30,
    facing: 'North-East',
    overlooking: 'Golf Course',
    balconies: 3,
    ageOfProperty: '1–5 years',
    images: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1400&q=80',
    ],
    featured: true,
    amenities: [
      'RERA Registered',
      'Golf Course View',
      'Clubhouse',
      'Swimming Pool',
      'Covered Parking',
      'Lift / Elevator',
      '24x7 Security',
      'Home Theatre',
      'Banquet Hall',
      'Gymnasium',
      'Modular Kitchen',
      'Air Conditioning',
    ],
    ...OWNERS.rhea,
    createdAt: new Date().toISOString(),
  },
  {
    title: 'Hinjawadi Grade-A Office Floor',
    description:
      'A full Grade-A office floor in Hinjawadi Phase 1 with 96 workstations, four meeting pods, a server room and 4 covered parking bays. The tower is LEED Gold certified with dual-zone HVAC, 100% power backup, redundant fibre from two providers and a 1,200 seat cafeteria. Available immediately on a 5+5 year lease with a three-month rent-free fit-out period.',
    price: 375000,
    listingType: 'commercial',
    category: 'Commercial',
    location: 'Hinjawadi, Pune',
    address: 'Hinjawadi Phase 1, Pune',
    city: 'Pune',
    state: 'Maharashtra',
    zipCode: '411057',
    bedrooms: 0,
    bathrooms: 4,
    sqft: 4800,
    carpetArea: 3900,
    builtUpArea: 4400,
    yearBuilt: 2019,
    garage: 4,
    furnishing: 'Unfurnished',
    possession: 'Ready to Move',
    rera: 'P51700011223',
    maintenance: 96000,
    securityDeposit: 2250000,
    floor: 9,
    totalFloors: 14,
    facing: 'East',
    balconies: 0,
    ageOfProperty: '1–5 years',
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=80',
    ],
    featured: false,
    amenities: [
      'RERA Registered',
      'High-Speed Fiber Internet',
      'Power Backup',
      'Covered Parking',
      'Visitor Parking',
      'Lift / Elevator',
      '24x7 Security',
      'CCTV Surveillance',
      'HVAC Dual Zone',
      'Banquet Hall',
    ],
    ...OWNERS.ananya,
    createdAt: new Date().toISOString(),
  },
  {
    title: 'Ulwe Residential Plot',
    description:
      'A 2,400 sq ft residential plot in a RERA-registered Ulwe layout, five minutes from the upcoming Navi Mumbai International Airport and the Atal Setu approach. The parcel is corner-facing, fully levelled, with a compound wall, gated entry, and water, electricity and sewage connections already at the site boundary. Approved for G+2 construction with 1.5 FSI.',
    price: 13500000,
    listingType: 'sale',
    category: 'Plot',
    location: 'Ulwe, Navi Mumbai',
    address: 'Sector 20, Ulwe',
    city: 'Navi Mumbai',
    state: 'Maharashtra',
    zipCode: '410206',
    bedrooms: 0,
    bathrooms: 0,
    sqft: 2400,
    lotSize: '2,400 sq ft plot',
    garage: 0,
    furnishing: 'Unfurnished',
    possession: 'Ready to Move',
    rera: 'P52000019988',
    facing: 'North-East',
    ageOfProperty: '0–1 years',
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1400&q=80',
    ],
    featured: false,
    amenities: [
      'RERA Registered',
      'Gated Township',
      'CCTV Surveillance',
      'Landscaped Garden',
      'Rain Water Harvesting',
      'Sewage Treatment Plant',
    ],
    ...OWNERS.meera,
    createdAt: new Date().toISOString(),
  },
  {
    title: 'Hebbal Lake-View 2 BHK on Rent',
    description:
      'A well-maintained two-bedroom rental apartment overlooking Hebbal Lake, five minutes from the airport exit and the ORR. The unit is semi-furnished with two air conditioners, wardrobes, a modular kitchen and one covered parking bay. Society amenities include a pool, gym, indoor games and 24x7 power backup.',
    price: 68000,
    listingType: 'rent',
    category: 'Apartment',
    location: 'Hebbal, Bengaluru',
    address: 'Hebbal Kempapura, Bengaluru',
    city: 'Bengaluru',
    state: 'Karnataka',
    zipCode: '560024',
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1290,
    carpetArea: 1050,
    builtUpArea: 1150,
    yearBuilt: 2017,
    garage: 1,
    furnishing: 'Semi-Furnished',
    possession: 'Ready to Move',
    rera: 'PRM/KA/RERA/1251/310/PR/171101/001922',
    maintenance: 3600,
    securityDeposit: 408000,
    floor: 9,
    totalFloors: 20,
    facing: 'East',
    overlooking: 'Hebbal Lake',
    balconies: 2,
    ageOfProperty: '5–10 years',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1400&q=80',
    ],
    featured: false,
    amenities: [
      'RERA Registered',
      'Clubhouse',
      'Swimming Pool',
      'Covered Parking',
      'Lift / Elevator',
      '24x7 Security',
      'Gymnasium',
      'Power Backup',
      'Air Conditioning',
    ],
    ...OWNERS.meera,
    createdAt: new Date().toISOString(),
  },
];

/* ==========================================================================
   Firestore access
   ========================================================================== */

/** Seed Firestore with the curated Indian inventory when the collection is empty. */
export async function seedPropertiesIfEmpty(): Promise<Property[]> {
  try {
    const propsCol = collection(db, 'properties');
    const snapshot = await getDocs(propsCol);

    if (!snapshot.empty) {
      const properties: Property[] = [];
      snapshot.forEach((docSnap) => {
        properties.push({ id: docSnap.id, ...docSnap.data() } as Property);
      });
      return properties;
    }

    const batch = writeBatch(db);
    const seededProperties: Property[] = [];

    for (const item of INITIAL_PROPERTIES) {
      const docRef = doc(propsCol);
      const newProp: Property = {
        ...item,
        id: docRef.id,
        createdAt: new Date().toISOString(),
      };
      batch.set(docRef, newProp);
      seededProperties.push(newProp);
    }

    await batch.commit();
    return seededProperties;
  } catch (error) {
    console.error('Error seeding properties to Firestore:', error);
    // Return the curated list locally so the marketplace stays usable.
    return INITIAL_PROPERTIES.map((property, index) => ({ ...property, id: `seed-${index}` }));
  }
}

/** Fetch every property listing. */
export async function fetchAllProperties(): Promise<Property[]> {
  try {
    const propsCol = collection(db, 'properties');
    const snapshot = await getDocs(propsCol);
    if (snapshot.empty) {
      return await seedPropertiesIfEmpty();
    }
    const properties: Property[] = [];
    snapshot.forEach((docSnap) => {
      properties.push({ id: docSnap.id, ...docSnap.data() } as Property);
    });
    return properties.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error('Error fetching properties from Firestore:', error);
    return seedPropertiesIfEmpty();
  }
}

/** Fetch a single property by id. */
export async function fetchPropertyById(id: string): Promise<Property | null> {
  try {
    const docRef = doc(db, 'properties', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Property;
    }
    return null;
  } catch (error) {
    console.error('Error fetching property by id:', error);
    return null;
  }
}

/** Create a new listing. */
export async function createProperty(
  propertyData: Omit<Property, 'id' | 'createdAt'>,
): Promise<Property> {
  const propsCol = collection(db, 'properties');
  const now = new Date().toISOString();
  try {
    const docRef = await addDoc(propsCol, {
      ...propertyData,
      createdAt: now,
      updatedAt: now,
    });
    return { ...propertyData, id: docRef.id, createdAt: now, updatedAt: now };
  } catch (error) {
    return handleFirestoreError(error, OperationType.CREATE, 'properties');
  }
}

/** Update an existing listing. */
export async function updateProperty(id: string, propertyData: Partial<Property>): Promise<void> {
  try {
    const docRef = doc(db, 'properties', id);
    await updateDoc(docRef, { ...propertyData, updatedAt: new Date().toISOString() });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `properties/${id}`);
  }
}

/** Delete a listing. */
export async function deleteProperty(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'properties', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `properties/${id}`);
  }
}

/* ================= VIEWINGS / APPOINTMENTS ================= */

/** Book a viewing appointment. */
export async function bookViewing(
  viewingData: Omit<Viewing, 'id' | 'createdAt' | 'status'>,
): Promise<Viewing> {
  const viewingsCol = collection(db, 'viewings');
  const now = new Date().toISOString();
  const newViewing = { ...viewingData, status: 'pending' as const, createdAt: now };
  try {
    const docRef = await addDoc(viewingsCol, newViewing);
    return { ...newViewing, id: docRef.id };
  } catch (error) {
    return handleFirestoreError(error, OperationType.CREATE, 'viewings');
  }
}

/** Viewings booked by a user. */
export async function fetchUserViewings(userId: string): Promise<Viewing[]> {
  try {
    const viewingsCol = collection(db, 'viewings');
    // NOTE: a single-field `where` query is used deliberately — combining it
    // with `orderBy` would require a composite index that a fresh Firebase
    // project does not have. Results are sorted client-side instead.
    const q = query(viewingsCol, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    const list: Viewing[] = [];
    snapshot.forEach((docSnap) => list.push({ id: docSnap.id, ...docSnap.data() } as Viewing));
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error('Error fetching user viewings:', error);
    return [];
  }
}

/** Viewings requested on a user's own listings. */
export async function fetchOwnerViewings(ownerId: string): Promise<Viewing[]> {
  try {
    const viewingsCol = collection(db, 'viewings');
    const q = query(viewingsCol, where('propertyOwnerId', '==', ownerId));
    const snapshot = await getDocs(q);
    const list: Viewing[] = [];
    snapshot.forEach((docSnap) => list.push({ id: docSnap.id, ...docSnap.data() } as Viewing));
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error('Error fetching owner viewings:', error);
    return [];
  }
}

/** Update a viewing status (confirm / complete / cancel). */
export async function updateViewingStatus(
  viewingId: string,
  status: Viewing['status'],
): Promise<void> {
  try {
    await updateDoc(doc(db, 'viewings', viewingId), { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `viewings/${viewingId}`);
  }
}

/** Remove a viewing record. */
export async function deleteViewing(viewingId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'viewings', viewingId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `viewings/${viewingId}`);
  }
}

