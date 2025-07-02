const express = require('express');
const router = express.Router();
const { Analytics, Venue, Session, TabItem } = require('../models');
const { Op } = require('sequelize');
const logger = require('../utils/logger');

// Get analytics for a venue
router.get('/venue/:venueId', async (req, res) => {
  try {
    const { venueId } = req.params;
    const { 
      startDate, 
      endDate, 
      granularity = 'daily',
      metrics = 'all'
    } = req.query;

    // Validate venue exists
    const venue = await Venue.findByPk(venueId);
    if (!venue) {
      return res.status(404).json({
        success: false,
        error: 'Venue not found'
      });
    }

    // Set default date range (last 30 days)
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Get analytics records for the date range
    const analytics = await Analytics.findAll({
      where: {
        venueId,
        date: {
          [Op.between]: [start.toISOString().split('T')[0], end.toISOString().split('T')[0]]
        }
      },
      order: [['date', 'ASC']]
    });

    // Calculate aggregate metrics
    const aggregateMetrics = {
      totalSessions: analytics.reduce((sum, a) => sum + a.totalSessions, 0),
      totalRevenue: analytics.reduce((sum, a) => sum + parseFloat(a.totalRevenue), 0),
      totalTips: analytics.reduce((sum, a) => sum + parseFloat(a.totalTips), 0),
      averageTabSize: analytics.length > 0 
        ? analytics.reduce((sum, a) => sum + parseFloat(a.averageTabSize), 0) / analytics.length 
        : 0,
      averageDwellTime: analytics.length > 0
        ? analytics.reduce((sum, a) => sum + a.averageDwellTime, 0) / analytics.length
        : 0,
      uniquePatrons: Math.max(...analytics.map(a => a.uniquePatrons), 0),
      tipConversionRate: analytics.length > 0
        ? analytics.reduce((sum, a) => sum + parseFloat(a.tipConversionRate), 0) / analytics.length
        : 0
    };

    // Get hourly breakdown (if premium tier)
    let hourlyData = null;
    if (venue.subscriptionTier === 'premium') {
      // Aggregate hourly data from analytics records
      const hourlyBreakdowns = analytics.map(a => a.hourlyBreakdown).filter(Boolean);
      if (hourlyBreakdowns.length > 0) {
        hourlyData = {};
        for (let hour = 0; hour < 24; hour++) {
          const hourKey = hour.toString();
          hourlyData[hourKey] = {
            sessions: hourlyBreakdowns.reduce((sum, hb) => sum + (hb[hourKey]?.sessions || 0), 0),
            revenue: hourlyBreakdowns.reduce((sum, hb) => sum + (hb[hourKey]?.revenue || 0), 0)
          };
        }
      }
    }

    // Get zone activity (if premium tier)
    let zoneActivity = null;
    if (venue.subscriptionTier === 'premium') {
      const zoneActivities = analytics.map(a => a.zoneActivity).filter(Boolean);
      if (zoneActivities.length > 0) {
        zoneActivity = {};
        zoneActivities.forEach(za => {
          Object.keys(za).forEach(zoneId => {
            if (!zoneActivity[zoneId]) {
              zoneActivity[zoneId] = { entries: 0, avgDwellTime: 0 };
            }
            zoneActivity[zoneId].entries += za[zoneId].entries || 0;
            zoneActivity[zoneId].avgDwellTime = (zoneActivity[zoneId].avgDwellTime + (za[zoneId].avgDwellTime || 0)) / 2;
          });
        });
      }
    }

    res.json({
      success: true,
      analytics: {
        dateRange: {
          start: start.toISOString().split('T')[0],
          end: end.toISOString().split('T')[0]
        },
        granularity,
        venue: {
          id: venue.id,
          name: venue.name,
          subscriptionTier: venue.subscriptionTier
        },
        aggregateMetrics,
        dailyData: analytics.map(a => ({
          date: a.date,
          totalSessions: a.totalSessions,
          totalRevenue: parseFloat(a.totalRevenue),
          totalTips: parseFloat(a.totalTips),
          averageTabSize: parseFloat(a.averageTabSize),
          averageDwellTime: a.averageDwellTime,
          uniquePatrons: a.uniquePatrons,
          tipConversionRate: parseFloat(a.tipConversionRate),
          peakHour: a.peakHour
        })),
        hourlyData,
        zoneActivity,
        paymentMethods: analytics.length > 0 ? analytics[analytics.length - 1].paymentMethods : null
      }
    });

  } catch (error) {
    logger.error('Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics'
    });
  }
});

// Generate analytics for a specific date (internal use)
router.post('/generate', async (req, res) => {
  try {
    const { venueId, date } = req.body;

    if (!venueId || !date) {
      return res.status(400).json({
        success: false,
        error: 'venueId and date are required'
      });
    }

    const analyticsData = await generateAnalyticsForDate(venueId, date);

    res.json({
      success: true,
      analytics: analyticsData
    });

  } catch (error) {
    logger.error('Error generating analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate analytics'
    });
  }
});

// Get real-time metrics for today
router.get('/venue/:venueId/realtime', async (req, res) => {
  try {
    const { venueId } = req.params;

    const today = new Date().toISOString().split('T')[0];
    const todayStart = new Date(today + 'T00:00:00.000Z');
    const now = new Date();

    // Get today's sessions
    const todaySessions = await Session.findAll({
      where: {
        venueId,
        createdAt: {
          [Op.gte]: todayStart,
          [Op.lte]: now
        }
      },
      include: ['tabItems', 'payments']
    });

    // Calculate real-time metrics
    const activeSessions = todaySessions.filter(s => s.status === 'active').length;
    const completedSessions = todaySessions.filter(s => s.status === 'closed');
    const totalRevenue = completedSessions.reduce((sum, s) => sum + parseFloat(s.total || 0), 0);
    const totalTips = completedSessions.reduce((sum, s) => sum + parseFloat(s.tipAmount || 0), 0);

    // Calculate hourly breakdown for today
    const hourlyBreakdown = {};
    for (let hour = 0; hour < 24; hour++) {
      hourlyBreakdown[hour] = { sessions: 0, revenue: 0 };
    }

    todaySessions.forEach(session => {
      const hour = new Date(session.createdAt).getHours();
      hourlyBreakdown[hour].sessions++;
      if (session.total) {
        hourlyBreakdown[hour].revenue += parseFloat(session.total);
      }
    });

    // Find peak hour
    const peakHour = Object.keys(hourlyBreakdown).reduce((peak, hour) => 
      hourlyBreakdown[hour].sessions > hourlyBreakdown[peak].sessions ? hour : peak
    );

    res.json({
      success: true,
      realTimeMetrics: {
        date: today,
        activeSessions,
        totalSessions: todaySessions.length,
        completedSessions: completedSessions.length,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalTips: Math.round(totalTips * 100) / 100,
        averageTabSize: completedSessions.length > 0 
          ? Math.round((totalRevenue / completedSessions.length) * 100) / 100 
          : 0,
        peakHour: parseInt(peakHour),
        hourlyBreakdown,
        lastUpdated: now.toISOString()
      }
    });

  } catch (error) {
    logger.error('Error fetching real-time metrics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch real-time metrics'
    });
  }
});

// Export analytics data (CSV/JSON)
router.get('/venue/:venueId/export', async (req, res) => {
  try {
    const { venueId } = req.params;
    const { format = 'json', startDate, endDate } = req.query;

    // Check if venue has premium subscription for exports
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
        error: 'Export feature requires premium subscription'
      });
    }

    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const analytics = await Analytics.findAll({
      where: {
        venueId,
        date: {
          [Op.between]: [start.toISOString().split('T')[0], end.toISOString().split('T')[0]]
        }
      },
      order: [['date', 'ASC']]
    });

    if (format === 'csv') {
      // Convert to CSV format
      const csvHeaders = 'Date,Sessions,Revenue,Tips,Avg Tab Size,Avg Dwell Time,Unique Patrons,Tip Conversion Rate\n';
      const csvData = analytics.map(a => 
        `${a.date},${a.totalSessions},${a.totalRevenue},${a.totalTips},${a.averageTabSize},${a.averageDwellTime},${a.uniquePatrons},${a.tipConversionRate}`
      ).join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=analytics-${venueId}-${start.toISOString().split('T')[0]}-to-${end.toISOString().split('T')[0]}.csv`);
      res.send(csvHeaders + csvData);
    } else {
      // Return JSON format
      res.json({
        success: true,
        export: {
          venue: {
            id: venue.id,
            name: venue.name
          },
          dateRange: {
            start: start.toISOString().split('T')[0],
            end: end.toISOString().split('T')[0]
          },
          data: analytics,
          exportedAt: new Date().toISOString()
        }
      });
    }

  } catch (error) {
    logger.error('Error exporting analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to export analytics'
    });
  }
});

// Helper function to generate analytics for a specific date
async function generateAnalyticsForDate(venueId, date) {
  const dateStart = new Date(date + 'T00:00:00.000Z');
  const dateEnd = new Date(date + 'T23:59:59.999Z');

  // Get sessions for the date
  const sessions = await Session.findAll({
    where: {
      venueId,
      createdAt: {
        [Op.between]: [dateStart, dateEnd]
      }
    },
    include: ['tabItems', 'payments']
  });

  const completedSessions = sessions.filter(s => s.status === 'closed');
  const totalRevenue = completedSessions.reduce((sum, s) => sum + parseFloat(s.total || 0), 0);
  const totalTips = completedSessions.reduce((sum, s) => sum + parseFloat(s.tipAmount || 0), 0);

  // Calculate dwell times
  const dwellTimes = completedSessions
    .filter(s => s.entryTime && s.exitTime)
    .map(s => (new Date(s.exitTime) - new Date(s.entryTime)) / (1000 * 60));
  const avgDwellTime = dwellTimes.length > 0 
    ? Math.round(dwellTimes.reduce((sum, time) => sum + time, 0) / dwellTimes.length)
    : 0;

  // Count unique patrons (simplified - in real app, use email/phone)
  const uniquePatrons = new Set(sessions.map(s => s.patronName.toLowerCase())).size;

  // Calculate tip conversion rate
  const sessionsWithTips = completedSessions.filter(s => parseFloat(s.tipAmount || 0) > 0).length;
  const tipConversionRate = completedSessions.length > 0 
    ? (sessionsWithTips / completedSessions.length) * 100 
    : 0;

  // Generate hourly breakdown
  const hourlyBreakdown = {};
  for (let hour = 0; hour < 24; hour++) {
    hourlyBreakdown[hour] = { sessions: 0, revenue: 0 };
  }

  sessions.forEach(session => {
    const hour = new Date(session.createdAt).getHours();
    hourlyBreakdown[hour].sessions++;
    if (session.total) {
      hourlyBreakdown[hour].revenue += parseFloat(session.total);
    }
  });

  // Find peak hour
  const peakHour = Object.keys(hourlyBreakdown).reduce((peak, hour) => 
    hourlyBreakdown[hour].sessions > hourlyBreakdown[peak].sessions ? parseInt(hour) : peak
  , 0);

  // Payment methods breakdown
  const paymentMethods = {
    visa: 0,
    mastercard: 0,
    amex: 0,
    other: 0
  };

  completedSessions.forEach(session => {
    // Simplified - in real app, get from payment records
    const method = session.payments?.[0]?.brand?.toLowerCase() || 'other';
    if (paymentMethods[method] !== undefined) {
      paymentMethods[method]++;
    } else {
      paymentMethods.other++;
    }
  });

  const analyticsData = {
    venueId,
    date,
    totalSessions: sessions.length,
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    totalTips: Math.round(totalTips * 100) / 100,
    averageTabSize: completedSessions.length > 0 
      ? Math.round((totalRevenue / completedSessions.length) * 100) / 100 
      : 0,
    averageDwellTime: avgDwellTime,
    uniquePatrons,
    tipConversionRate: Math.round(tipConversionRate * 100) / 100,
    peakHour,
    hourlyBreakdown,
    paymentMethods
  };

  // Save or update analytics record
  await Analytics.upsert(analyticsData);

  return analyticsData;
}

module.exports = router;