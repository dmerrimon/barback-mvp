const express = require('express');
const router = express.Router();

// For MVP, create simple placeholder routes to avoid module loading errors
// Import route modules
try {
  const sessionRoutes = require('./sessions');
  const paymentRoutes = require('./payments');
  const beaconRoutes = require('./beacons');
  const venueRoutes = require('./venues');
  const analyticsRoutes = require('./analytics');
  const qrRoutes = require('./qr');

  // API routes
  router.use('/sessions', sessionRoutes);
  router.use('/payments', paymentRoutes);
  router.use('/beacons', beaconRoutes);
  router.use('/venues', venueRoutes);
  router.use('/analytics', analyticsRoutes);
  router.use('/qr', qrRoutes);
} catch (error) {
  console.log('Route modules not found, using MVP placeholder routes');
  
  // MVP placeholder routes
  router.get('/sessions', (req, res) => res.json({ message: 'Sessions API - MVP mode' }));
  router.get('/payments', (req, res) => res.json({ message: 'Payments API - MVP mode' }));
  router.get('/beacons', (req, res) => res.json({ message: 'Beacons API - MVP mode' }));
  router.get('/venues', (req, res) => res.json({ message: 'Venues API - MVP mode' }));
  router.get('/analytics', (req, res) => res.json({ message: 'Analytics API - MVP mode' }));
  router.get('/qr', (req, res) => res.json({ message: 'QR API - MVP mode' }));
}

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    message: 'Barback API v1.0',
    version: '1.0.0',
    endpoints: {
      sessions: '/api/sessions',
      payments: '/api/payments',
      beacons: '/api/beacons',
      venues: '/api/venues',
      analytics: '/api/analytics',
      qr: '/api/qr'
    },
    timestamp: new Date().toISOString()
  });
});

module.exports = router;