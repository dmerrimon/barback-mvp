import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './components/AdminDashboard';
import BartenderDashboard from './components/BartenderDashboard';
import HomePage from './components/HomePage';
import LoginScreen from './components/LoginScreen';

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: var(--bg-primary);
  color: var(--text-primary);
`;

function App() {
  return (
    <AuthProvider>
      <AppContainer>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginScreen onLogin={() => {}} />} />
            <Route 
              path="/admin/:venueId" 
              element={
                <ProtectedRoute requiredRole="owner">
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/bartender/:venueId" 
              element={
                <ProtectedRoute requiredRole="bartender">
                  <BartenderDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Router>
      </AppContainer>
    </AuthProvider>
  );
}

export default App;
