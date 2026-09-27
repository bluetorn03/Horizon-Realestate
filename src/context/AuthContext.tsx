import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { avatarImage } from '../lib/images';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  demoLogin: (role?: 'buyer' | 'agent') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USERS = {
  buyer: {
    email: 'buyer.demo@horizonestates.in',
    name: 'Aarav Mehta',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
  },
  agent: {
    email: 'advisor.demo@horizonestates.in',
    name: 'Rhea Malhotra (Private Advisor)',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error) {
      console.error('Email sign-in error:', error);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, pass: string, displayName: string) => {
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, pass);
      if (credential.user) {
        await updateProfile(credential.user, {
          displayName,
          photoURL: avatarImage('photo-1573496359142-b8d87734a5a2'),
        });
      }
    } catch (error) {
      console.error('Email sign-up error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign-out error:', error);
      throw error;
    }
  };

  /**
   * One-click demo session. Creates the account on first use so the flow works
   * against a brand-new Firebase project with no manual seeding.
   */
  const demoLogin = async (role: 'buyer' | 'agent' = 'buyer') => {
    const profile = DEMO_USERS[role];
    const demoPass = 'Horizon@Demo2026';
    try {
      await signInWithEmailAndPassword(auth, profile.email, demoPass);
    } catch {
      try {
        const credential = await createUserWithEmailAndPassword(auth, profile.email, demoPass);
        await updateProfile(credential.user, { displayName: profile.name, photoURL: profile.photo });
      } catch (createError) {
        console.error('Demo account creation error:', createError);
        throw createError;
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        logout,
        demoLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
