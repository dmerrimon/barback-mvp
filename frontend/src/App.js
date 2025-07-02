import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

// Pages
import HomePage from './pages/HomePage';
import SessionPage from './pages/SessionPage';
import BartenderDashboard from './pages/BartenderDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import QRScanPage from './pages/QRScanPage';
import PaymentPage from './pages/PaymentPage';
import ReceiptPage from './pages/ReceiptPage';

// Components
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';

// Initialize Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

function App() {
  return (
    <ErrorBoundary>
      <Elements stripe={stripePromise}>
        <Layout>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/scan" element={<QRScanPage />} />
            <Route path="/session/:sessionId" element={<SessionPage />} />
            <Route path="/payment/:sessionId" element={<PaymentPage />} />
            <Route path="/receipt/:sessionId" element={<ReceiptPage />} />
            
            {/* Dashboard routes */}
            <Route path="/bartender/:venueId" element={<BartenderDashboard />} />
            <Route path="/owner/:venueId" element={<OwnerDashboard />} />
            <Route path="/admin/:venueId" element={<AdminDashboard />} />
            
            {/* 404 */}
            <Route path="*" element={
              <div style={{ 
                textAlign: 'center', 
                padding: '2rem',
                color: 'var(--text-secondary)' 
              }}>
                <h1>404 - Page Not Found</h1>
                <p>The page you're looking for doesn't exist.</p>
              </div>
            } />
          </Routes>
        </Layout>
      </Elements>
    </ErrorBoundary>
  );
}

export default App;