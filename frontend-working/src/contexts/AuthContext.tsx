import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInUser, 
  signOutUser, 
  onAuthStateChange, 
  getUserData,
  createDemoAccounts,
  USER_ROLES
} from '../services/authService';
import { initializeVenueWithDemoData } from '../services/firestoreService';

interface User {
  uid: string;
  email: string;
  role: 'owner' | 'manager' | 'bartender' | 'server';
  name: string;
  venueId: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: { email: string; password: string; role: string }) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [demoAccountsCreated, setDemoAccountsCreated] = useState(false);

  // Initialize demo venue and accounts on first load
  useEffect(() => {
    const initializeDemoData = async () => {
      try {
        const demoVenueId = 'demo-venue-001';
        
        // Check if demo accounts were already created
        const created = localStorage.getItem('demo_accounts_created');
        if (!created && !demoAccountsCreated) {
          // Initialize demo venue
          await initializeVenueWithDemoData(demoVenueId, 'The Digital Tap');
          
          // Create demo accounts
          await createDemoAccounts(demoVenueId);
          
          localStorage.setItem('demo_accounts_created', 'true');
          setDemoAccountsCreated(true);
          console.log('Demo accounts and venue initialized');
        }
      } catch (error) {
        console.log('Demo initialization completed or accounts exist:', error.message);
      }
    };

    initializeDemoData();
  }, [demoAccountsCreated]);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      setIsLoading(true);
      
      if (firebaseUser) {
        try {
          // Get additional user data from Firestore
          const userData = await getUserData(firebaseUser.uid);
          
          if (userData) {
            const user: User = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              role: userData.role,
              name: userData.name || firebaseUser.displayName || 'User',
              venueId: userData.venueId || 'demo-venue-001'
            };
            setUser(user);
          } else {
            // User exists in Firebase Auth but not in Firestore
            console.error('User data not found in Firestore');
            setUser(null);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (credentials: { email: string; password: string; role: string }) => {
    setIsLoading(true);
    
    try {
      // Sign in with Firebase
      const firebaseUser = await signInUser(credentials.email, credentials.password);
      
      // Get user data from Firestore
      const userData = await getUserData(firebaseUser.uid);
      
      if (!userData) {
        throw new Error('User data not found. Please contact support.');
      }

      // Firebase auth state listener will handle setting the user
    } catch (error) {
      console.error('Login failed:', error);
      setIsLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOutUser();
      // Firebase auth state listener will handle clearing the user
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};