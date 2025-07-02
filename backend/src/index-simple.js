const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

// Basic middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Barback Backend API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API root
app.get('/api', (req, res) => {
  res.json({
    message: 'Barback API v1.0 - MVP',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      sessions: '/api/sessions',
      payments: '/api/payments',
      beacons: '/api/beacons',
      venues: '/api/venues'
    },
    timestamp: new Date().toISOString()
  });
});

// Simple MVP routes
app.get('/api/sessions', (req, res) => {
  res.json({ 
    message: 'Sessions API - MVP mode',
    mockSessions: [
      { id: 1, customerName: 'John Doe', tableNumber: '5', status: 'active', total: 47.50 },
      { id: 2, customerName: 'Jane Smith', tableNumber: '3', status: 'active', total: 23.75 }
    ]
  });
});

app.get('/api/venues', (req, res) => {
  res.json({ 
    message: 'Venues API - MVP mode',
    venue: {
      id: 1,
      name: 'The Digital Tap',
      address: '123 Tech Street',
      status: 'active'
    }
  });
});

app.get('/api/beacons', (req, res) => {
  res.json({ 
    message: 'Beacons API - MVP mode',
    beacons: [
      { id: 1, name: 'Entry Beacon', status: 'active', battery: 85 },
      { id: 2, name: 'Exit Beacon', status: 'active', battery: 92 }
    ]
  });
});

app.get('/api/payments', (req, res) => {
  res.json({ message: 'Payments API - MVP mode' });
});

// Catch all
app.get('*', (req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    message: 'This is the Barback API. Visit /api for available endpoints.'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🍻 Barback MVP API running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

module.exports = app;