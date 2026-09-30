import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updateProfile, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

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
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error: any) {
      console.error('Email sign-in error:', error);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, pass: string, displayName: string) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      if (res.user) {
        await updateProfile(res.user, {
          displayName,
          photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayName)}`
        });
      }
    } catch (error: any) {
      console.error('Email sign-up error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const demoLogin = async (role: 'buyer' | 'agent' = 'buyer') => {
    // If not using real credentials, generate a demo user or sign in with test email
    const demoEmail = role === 'agent' ? 'agent.demo@horizonestates.in' : 'buyer.demo@horizonestates.in';
    const demoPass = 'DemoPassword123!';
    const demoName = role === 'agent' ? 'Vikram Rathore (Advisor)' : 'Aarav Mehta';

    try {
      await signInWithEmailAndPassword(auth, demoEmail, demoPass);
    } catch (e) {
      // If doesn't exist, create it
      try {
        const res = await createUserWithEmailAndPassword(auth, demoEmail, demoPass);
        if (res.user) {
          await updateProfile(res.user, {
            displayName: demoName,
            photoURL: role === 'agent' 
              ? 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80'
              : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'
          });
        }
      } catch (createErr) {
        console.error('Demo user creation error:', createErr);
        throw createErr;
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
        demoLogin
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
