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
import { INITIAL_PROPERTIES, CATALOG_VERSION } from '../data/properties';

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
    operationType,
    path,
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
    }
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

const PROPERTIES_COLLECTION = 'properties';

function toProperty(id: string, data: Record<string, any>): Property {
  return { id, ...(data as Omit<Property, 'id'>) };
}

/**
 * Seed the curated catalog once, using deterministic document ids so a
 * double-invoked effect (React StrictMode) can never create duplicates.
 * Listings from older catalog generations are left in place but ignored.
 */
let seedInFlight: Promise<Property[]> | null = null;

export function seedPropertiesIfEmpty(): Promise<Property[]> {
  if (!seedInFlight) {
    seedInFlight = (async () => {
      try {
        const propsCol = collection(db, PROPERTIES_COLLECTION);
        const snapshot = await getDocs(propsCol);
        const current: Property[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          if (data.catalogVersion === CATALOG_VERSION) {
            current.push(toProperty(docSnap.id, data));
          }
        });

        if (current.length > 0) return current;

        console.log('Seeding curated property catalog to Firestore...');
        const batch = writeBatch(db);
        const now = new Date().toISOString();
        const seeded: Property[] = [];

        INITIAL_PROPERTIES.forEach((item, index) => {
          const docRef = doc(propsCol, `horizon-listing-${String(index + 1).padStart(2, '0')}`);
          const record: Property = {
            ...item,
            id: docRef.id,
            catalogVersion: CATALOG_VERSION,
            createdAt: now,
          };
          batch.set(docRef, record);
          seeded.push(record);
        });

        await batch.commit();
        console.log(`Seeded ${seeded.length} properties to Firestore.`);
        return seeded;
      } catch (error) {
        console.error('Error in seedPropertiesIfEmpty:', error);
        // Return the in-memory catalog so the UI remains fully functional offline
        return INITIAL_PROPERTIES.map((p, idx) => ({
          ...p,
          id: `seed-${idx}`,
          catalogVersion: CATALOG_VERSION,
          createdAt: new Date().toISOString(),
        }));
      } finally {
        seedInFlight = null;
      }
    })();
  }
  return seedInFlight;
}

// Fetch all properties from Firestore (current catalog generation only)
export async function fetchAllProperties(): Promise<Property[]> {
  try {
    const propsCol = collection(db, PROPERTIES_COLLECTION);
    const snapshot = await getDocs(propsCol);
    const current: Property[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.catalogVersion === CATALOG_VERSION) {
        current.push(toProperty(docSnap.id, data));
      }
    });

    if (current.length === 0) {
      return await seedPropertiesIfEmpty();
    }

    // Sort by createdAt descending
    return current.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error('Error fetching properties from Firestore:', error);
    return seedPropertiesIfEmpty();
  }
}

// Fetch a single property
export async function fetchPropertyById(id: string): Promise<Property | null> {
  try {
    const docRef = doc(db, PROPERTIES_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return toProperty(docSnap.id, docSnap.data());
    }
    return null;
  } catch (error) {
    console.error('Error fetching property by ID:', error);
    return null;
  }
}

// Create a new property listing
export async function createProperty(propertyData: Omit<Property, 'id' | 'createdAt'>): Promise<Property> {
  const propsCol = collection(db, PROPERTIES_COLLECTION);
  const now = new Date().toISOString();
  try {
    const docRef = await addDoc(propsCol, {
      ...propertyData,
      catalogVersion: CATALOG_VERSION,
      createdAt: now,
      updatedAt: now
    });
    
    return {
      ...propertyData,
      id: docRef.id,
      catalogVersion: CATALOG_VERSION,
      createdAt: now,
      updatedAt: now
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, PROPERTIES_COLLECTION);
  }
}

// Update existing property
export async function updateProperty(id: string, propertyData: Partial<Property>): Promise<void> {
  try {
    const docRef = doc(db, PROPERTIES_COLLECTION, id);
    await updateDoc(docRef, {
      ...propertyData,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${PROPERTIES_COLLECTION}/${id}`);
  }
}

// Delete a property
export async function deleteProperty(id: string): Promise<void> {
  try {
    const docRef = doc(db, PROPERTIES_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${PROPERTIES_COLLECTION}/${id}`);
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
