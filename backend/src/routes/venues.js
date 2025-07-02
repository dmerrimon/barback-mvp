const express = require('express');
const router = express.Router();
const { Venue, Session, Analytics } = require('../models');
const logger = require('../utils/logger');

// Get venue details
router.get('/:venueId', async (req, res) => {
  try {
    const { venueId } = req.params;

    const venue = await Venue.findByPk(venueId, {
      include: [
        {
          model: Session,
          as: 'sessions',
          where: { status: ['pending', 'active'] },
          required: false
        }
      ]
    });

    if (!venue) {
      return res.status(404).json({
        success: false,
        error: 'Venue not found'
      });
    }

    res.json({
      success: true,
      venue: {
        id: venue.id,
        name: venue.name,
        address: venue.address,
        phone: venue.phone,
        email: venue.email,
        settings: venue.settings,
        subscriptionTier: venue.subscriptionTier,
        activeSessions: venue.sessions?.length || 0,
        isActive: venue.isActive
      }
    });

  } catch (error) {
    logger.error('Error fetching venue:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch venue'
    });
  }
});

// Update venue settings
router.patch('/:venueId/settings', async (req, res) => {
  try {
    const { venueId } = req.params;
    const { settings } = req.body;

    const venue = await Venue.findByPk(venueId);
    if (!venue) {
      return res.status(404).json({
        success: false,
        error: 'Venue not found'
      });
    }

    // Merge new settings with existing ones
    const updatedSettings = {
      ...venue.settings,
      ...settings
    };

    await venue.update({ settings: updatedSettings });

    logger.info(`Venue settings updated: ${venueId}`);

    res.json({
      success: true,
      venue: {
        id: venue.id,
        settings: venue.settings
      }
    });

  } catch (error) {
    logger.error('Error updating venue settings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update venue settings'
    });
  }
});

// Get venue dashboard stats
router.get('/:venueId/stats', async (req, res) => {
  try {
    const { venueId } = req.params;
    const { timeRange = '7d' } = req.query;

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
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }

    // Get sessions in date range
    const sessions = await Session.findAll({
      where: {
        venueId,
        createdAt: {
          [require('sequelize').Op.gte]: startDate
        }
      },
      include: ['tabItems', 'payments']
    });

    // Calculate metrics
    const totalSessions = sessions.length;
    const completedSessions = sessions.filter(s => s.status === 'closed');
    const totalRevenue = completedSessions.reduce((sum, s) => sum + parseFloat(s.total || 0), 0);
    const totalTips = completedSessions.reduce((sum, s) => sum + parseFloat(s.tipAmount || 0), 0);
    
    // Calculate average dwell time (in minutes)
    const dwellTimes = completedSessions
      .filter(s => s.entryTime && s.exitTime)
      .map(s => (new Date(s.exitTime) - new Date(s.entryTime)) / (1000 * 60));
    const avgDwellTime = dwellTimes.length > 0 
      ? dwellTimes.reduce((sum, time) => sum + time, 0) / dwellTimes.length 
      : 0;

    // Calculate previous period for comparison
    const prevStartDate = new Date(startDate);
    const daysDiff = Math.ceil((now - startDate) / (1000 * 60 * 60 * 24));
    prevStartDate.setDate(startDate.getDate() - daysDiff);

    const prevSessions = await Session.findAll({
      where: {
        venueId,
        createdAt: {
          [require('sequelize').Op.gte]: prevStartDate,
          [require('sequelize').Op.lt]: startDate
        }
      }
    });

    const prevCompletedSessions = prevSessions.filter(s => s.status === 'closed');
    const prevRevenue = prevCompletedSessions.reduce((sum, s) => sum + parseFloat(s.total || 0), 0);
    const prevTotalSessions = prevSessions.length;

    // Calculate percentage changes
    const revenueChange = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0;
    const sessionsChange = prevTotalSessions > 0 ? ((totalSessions - prevTotalSessions) / prevTotalSessions) * 100 : 0;

    // Daily breakdown for charts
    const dailyStats = [];
    for (let d = new Date(startDate); d <= now; d.setDate(d.getDate() + 1)) {
      const dayStart = new Date(d);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(d);
      dayEnd.setHours(23, 59, 59, 999);

      const daySessions = sessions.filter(s => {
        const sessionDate = new Date(s.createdAt);
        return sessionDate >= dayStart && sessionDate <= dayEnd;
      });

      const dayCompleted = daySessions.filter(s => s.status === 'closed');
      const dayRevenue = dayCompleted.reduce((sum, s) => sum + parseFloat(s.total || 0), 0);

      dailyStats.push({
        date: d.toISOString().split('T')[0],
        sessions: daySessions.length,
        revenue: Math.round(dayRevenue * 100) / 100,
        completedSessions: dayCompleted.length
      });
    }

    res.json({
      success: true,
      stats: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalSessions,
        totalTips: Math.round(totalTips * 100) / 100,
        avgDwellTime: Math.round(avgDwellTime),
        revenueChange: Math.round(revenueChange * 10) / 10,
        sessionsChange: Math.round(sessionsChange * 10) / 10,
        completionRate: totalSessions > 0 ? Math.round((completedSessions.length / totalSessions) * 100) : 0,
        avgTabSize: completedSessions.length > 0 ? Math.round((totalRevenue / completedSessions.length) * 100) / 100 : 0
      },
      dailyStats,
      timeRange
    });

  } catch (error) {
    logger.error('Error fetching venue stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch venue statistics'
    });
  }
});

// Get venue menu/items (for adding to tabs)
router.get('/:venueId/menu', async (req, res) => {
  try {
    const { venueId } = req.params;

    // In a real app, you'd have a Menu/MenuItem model
    // For now, return mock menu data
    const mockMenu = {
      categories: [
        {
          id: 'beer',
          name: 'Beer',
          items: [
            { id: 'craft-ipa', name: 'Craft IPA', price: 8.50, description: 'Local brewery IPA' },
            { id: 'lager', name: 'Premium Lager', price: 7.00, description: 'Crisp and refreshing' },
            { id: 'wheat-beer', name: 'Wheat Beer', price: 7.50, description: 'Smooth wheat beer' }
          ]
        },
        {
          id: 'cocktails',
          name: 'Cocktails',
          items: [
            { id: 'old-fashioned', name: 'Old Fashioned', price: 12.00, description: 'Classic whiskey cocktail' },
            { id: 'margarita', name: 'Margarita', price: 11.00, description: 'Fresh lime and tequila' },
            { id: 'moscow-mule', name: 'Moscow Mule', price: 10.50, description: 'Vodka, ginger beer, lime' }
          ]
        },
        {
          id: 'food',
          name: 'Food',
          items: [
            { id: 'wings', name: 'Buffalo Wings', price: 12.50, description: '8 pieces with celery' },
            { id: 'burger', name: 'Classic Burger', price: 15.50, description: 'Beef patty with fries' },
            { id: 'nachos', name: 'Loaded Nachos', price: 11.75, description: 'Cheese, jalapeños, sour cream' }
          ]
        }
      ]
    };

    res.json({
      success: true,
      menu: mockMenu
    });

  } catch (error) {
    logger.error('Error fetching venue menu:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch venue menu'
    });
  }
});

// Create new venue (admin only)
router.post('/', async (req, res) => {
  try {
    const { name, address, phone, email, settings } = req.body;

    const venue = await Venue.create({
      name,
      address,
      phone,
      email,
      settings: {
        autoCloseTabMinutes: 30,
        tipSuggestions: [15, 18, 20, 25],
        requireTipBeforeClose: false,
        maxTabAmount: 500,
        beaconExitDelaySeconds: 10,
        ...settings
      }
    });

    logger.info(`New venue created: ${venue.id} - ${name}`);

    res.status(201).json({
      success: true,
      venue: {
        id: venue.id,
        name: venue.name,
        address: venue.address,
        settings: venue.settings
      }
    });

  } catch (error) {
    logger.error('Error creating venue:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create venue'
    });
  }
});

module.exports = router;