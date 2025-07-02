import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
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

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('barback_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('barback_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: { email: string; password: string; role: string }) => {
    setIsLoading(true);
    
    try {
      // For MVP, create mock user based on role and email
      const mockUser: User = {
        id: `user_${Date.now()}`,
        email: credentials.email,
        role: credentials.role as User['role'],
        name: getUserNameFromEmail(credentials.email, credentials.role),
        venueId: 'venue_demo_001'
      };

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // For demo purposes, accept any password that's not empty
      if (credentials.password.length === 0) {
        throw new Error('Password is required');
      }

      setUser(mockUser);
      localStorage.setItem('barback_user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('barback_user');
  };

  const getUserNameFromEmail = (email: string, role: string): string => {
    const emailMap: Record<string, string> = {
      'owner@thedigitaltap.com': 'Sarah Johnson',
      'manager@thedigitaltap.com': 'Mike Chen',
      'bartender@thedigitaltap.com': 'Alex Rodriguez',
      'server@thedigitaltap.com': 'Emma Davis'
    };

    return emailMap[email] || `${role.charAt(0).toUpperCase() + role.slice(1)} User`;
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