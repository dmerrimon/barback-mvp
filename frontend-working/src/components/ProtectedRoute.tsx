import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoginScreen from './LoginScreen';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'owner' | 'manager' | 'bartender' | 'server';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user, isAuthenticated, login } = useAuth();

  if (!isAuthenticated) {
    return <LoginScreen onLogin={login} />;
  }

  // Check role-based access
  if (requiredRole && user?.role !== requiredRole) {
    // Allow owner and manager to access all areas
    const hasAccess = user?.role === 'owner' || 
                     user?.role === 'manager' || 
                     user?.role === requiredRole;
    
    if (!hasAccess) {
      return (
        <div style={{ 
          padding: '2rem', 
          textAlign: 'center',
          color: 'var(--text-primary)'
        }}>
          <h2>Access Denied</h2>
          <p>You don't have permission to access this area.</p>
          <p>Required role: {requiredRole}</p>
          <p>Your role: {user?.role}</p>
        </div>
      );
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;