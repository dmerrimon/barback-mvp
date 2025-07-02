const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const { Venue } = require('../models');
const logger = require('../utils/logger');

// Generate QR code for venue table
router.post('/generate', async (req, res) => {
  try {
    const { venueId, tableNumber, customData = {} } = req.body;

    if (!venueId) {
      return res.status(400).json({
        success: false,
        error: 'venueId is required'
      });
    }

    // Verify venue exists
    const venue = await Venue.findByPk(venueId);
    if (!venue) {
      return res.status(404).json({
        success: false,
        error: 'Venue not found'
      });
    }

    // Generate unique session ID for this QR code
    const sessionId = uuidv4();
    
    // Create QR code data URL
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const qrData = {
      url: `${baseUrl}/session/new`,
      venueId,
      tableNumber: tableNumber || '',
      sessionId,
      timestamp: Date.now(),
      ...customData
    };

    // Convert to URL with query parameters
    const params = new URLSearchParams();
    Object.keys(qrData).forEach(key => {
      if (qrData[key] !== '') {
        params.append(key, qrData[key]);
      }
    });
    
    const qrUrl = `${qrData.url}?${params.toString()}`;

    // Generate QR code image
    const qrCodeDataURL = await QRCode.toDataURL(qrUrl, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      width: 300
    });

    // Also generate SVG version for better scaling
    const qrCodeSVG = await QRCode.toString(qrUrl, {
      type: 'svg',
      errorCorrectionLevel: 'M',
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      width: 300
    });

    logger.info(`QR code generated for venue ${venueId}, table ${tableNumber}`);

    res.json({
      success: true,
      qrCode: {
        sessionId,
        venueId,
        tableNumber,
        url: qrUrl,
        dataURL: qrCodeDataURL,
        svg: qrCodeSVG,
        data: qrData,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    logger.error('Error generating QR code:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate QR code'
    });
  }
});

// Generate multiple QR codes for venue tables
router.post('/generate-batch', async (req, res) => {
  try {
    const { venueId, tableNumbers, customData = {} } = req.body;

    if (!venueId || !Array.isArray(tableNumbers)) {
      return res.status(400).json({
        success: false,
        error: 'venueId and tableNumbers array are required'
      });
    }

    // Verify venue exists
    const venue = await Venue.findByPk(venueId);
    if (!venue) {
      return res.status(404).json({
        success: false,
        error: 'Venue not found'
      });
    }

    const qrCodes = [];
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    for (const tableNumber of tableNumbers) {
      const sessionId = uuidv4();
      
      const qrData = {
        url: `${baseUrl}/session/new`,
        venueId,
        tableNumber: tableNumber.toString(),
        sessionId,
        timestamp: Date.now(),
        ...customData
      };

      const params = new URLSearchParams();
      Object.keys(qrData).forEach(key => {
        if (qrData[key] !== '') {
          params.append(key, qrData[key]);
        }
      });
      
      const qrUrl = `${qrData.url}?${params.toString()}`;

      // Generate QR code for this table
      const qrCodeDataURL = await QRCode.toDataURL(qrUrl, {
        errorCorrectionLevel: 'M',
        type: 'image/png',
        quality: 0.92,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        width: 300
      });

      const qrCodeSVG = await QRCode.toString(qrUrl, {
        type: 'svg',
        errorCorrectionLevel: 'M',
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        width: 300
      });

      qrCodes.push({
        sessionId,
        tableNumber: tableNumber.toString(),
        url: qrUrl,
        dataURL: qrCodeDataURL,
        svg: qrCodeSVG,
        data: qrData
      });
    }

    logger.info(`Batch QR codes generated for venue ${venueId}, ${tableNumbers.length} tables`);

    res.json({
      success: true,
      venue: {
        id: venue.id,
        name: venue.name
      },
      qrCodes,
      generatedAt: new Date().toISOString(),
      count: qrCodes.length
    });

  } catch (error) {
    logger.error('Error generating batch QR codes:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate batch QR codes'
    });
  }
});

// Validate QR code data
router.post('/validate', async (req, res) => {
  try {
    const { qrData } = req.body;

    if (!qrData) {
      return res.status(400).json({
        success: false,
        error: 'qrData is required'
      });
    }

    let parsedData;
    
    // Handle different QR data formats
    if (typeof qrData === 'string') {
      try {
        // Try to parse as URL
        const url = new URL(qrData);
        parsedData = {
          url: url.origin + url.pathname,
          venueId: url.searchParams.get('venueId'),
          tableNumber: url.searchParams.get('tableNumber'),
          sessionId: url.searchParams.get('sessionId'),
          timestamp: url.searchParams.get('timestamp')
        };
      } catch (err) {
        // Try to parse as JSON
        try {
          parsedData = JSON.parse(qrData);
        } catch (jsonErr) {
          return res.status(400).json({
            success: false,
            error: 'Invalid QR data format'
          });
        }
      }
    } else {
      parsedData = qrData;
    }

    // Validate required fields
    if (!parsedData.venueId) {
      return res.status(400).json({
        success: false,
        error: 'Invalid QR code: missing venue information'
      });
    }

    // Verify venue exists and is active
    const venue = await Venue.findByPk(parsedData.venueId);
    if (!venue) {
      return res.status(404).json({
        success: false,
        error: 'Venue not found'
      });
    }

    if (!venue.isActive) {
      return res.status(400).json({
        success: false,
        error: 'Venue is currently inactive'
      });
    }

    // Check if QR code is expired (optional - based on timestamp)
    if (parsedData.timestamp) {
      const qrAge = Date.now() - parseInt(parsedData.timestamp);
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours
      
      if (qrAge > maxAge) {
        return res.status(400).json({
          success: false,
          error: 'QR code has expired'
        });
      }
    }

    res.json({
      success: true,
      valid: true,
      data: parsedData,
      venue: {
        id: venue.id,
        name: venue.name,
        address: venue.address,
        settings: venue.settings
      },
      message: 'QR code is valid'
    });

  } catch (error) {
    logger.error('Error validating QR code:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to validate QR code'
    });
  }
});

// Get QR code analytics (for premium venues)
router.get('/analytics/:venueId', async (req, res) => {
  try {
    const { venueId } = req.params;
    const { timeRange = '7d' } = req.query;

    // Verify venue exists and has premium access
    const venue = await Venue.findByPk(venueId);
    if (!venue) {
      return res.status(404).json({
        success: false,
        error: 'Venue not found'
      });
    }

    if (venue.subscriptionTier !== 'premium') {
      return res.status(403).json({
        success: false,
        error: 'QR analytics require premium subscription'
      });
    }

    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    
    switch (timeRange) {
      case '1d':
        startDate.setDate(now.getDate() - 1);
        break;
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }

    // In a real app, you'd track QR scans in a separate table
    // For now, we'll use session creation as a proxy for QR scans
    const { Session } = require('../models');
    
    const sessions = await Session.findAll({
      where: {
        venueId,
        createdAt: {
          [require('sequelize').Op.gte]: startDate
        }
      },
      attributes: ['createdAt', 'tableNumber', 'status'],
      order: [['createdAt', 'ASC']]
    });

    // Analyze QR scan patterns
    const scansByTable = {};
    const scansByHour = {};
    const scansByDay = {};

    sessions.forEach(session => {
      const date = new Date(session.createdAt);
      const hour = date.getHours();
      const day = date.toISOString().split('T')[0];
      const table = session.tableNumber || 'unknown';

      // Count by table
      scansByTable[table] = (scansByTable[table] || 0) + 1;

      // Count by hour
      scansByHour[hour] = (scansByHour[hour] || 0) + 1;

      // Count by day
      scansByDay[day] = (scansByDay[day] || 0) + 1;
    });

    res.json({
      success: true,
      analytics: {
        venueId,
        timeRange,
        totalScans: sessions.length,
        uniqueTables: Object.keys(scansByTable).length,
        peakHour: Object.keys(scansByHour).reduce((peak, hour) => 
          (scansByHour[hour] > (scansByHour[peak] || 0)) ? hour : peak
        , '0'),
        scansByTable,
        scansByHour,
        scansByDay,
        conversionRate: sessions.length > 0 
          ? (sessions.filter(s => s.status === 'closed').length / sessions.length) * 100 
          : 0
      }
    });

  } catch (error) {
    logger.error('Error fetching QR analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch QR analytics'
    });
  }
});

module.exports = router;