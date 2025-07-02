const express = require('express');
const router = express.Router();

// Import route modules
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