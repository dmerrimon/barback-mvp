const express = require('express');
const router = express.Router();
const { Session, TabItem, Venue } = require('../models');
const { validateSession } = require('../middleware/validation');
const logger = require('../utils/logger');

// Create new session (QR scan entry point)
router.post('/', validateSession, async (req, res) => {
  try {
    const { venueId, patronName, patronPhone, patronEmail, tableNumber } = req.body;

    // Generate QR code data
    const qrData = `${process.env.FRONTEND_URL}/session/${req.body.sessionId || 'new'}`;

    const session = await Session.create({
      venueId,
      patronName,
      patronPhone,
      patronEmail,
      tableNumber,
      qrCode: qrData,
      status: 'pending'
    });

    // Emit real-time update to bartender dashboard
    req.io.to(`bartender-${venueId}`).emit('new-session', session);

    logger.info(`New session created: ${session.id} for ${patronName}`);

    res.status(201).json({
      success: true,
      session: {
        id: session.id,
        venueId: session.venueId,
        patronName: session.patronName,
        status: session.status,
        qrCode: session.qrCode,
        tableNumber: session.tableNumber
      }
    });
  } catch (error) {
    logger.error('Error creating session:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create session' 
    });
  }
});

// Get session details
router.get('/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await Session.findByPk(sessionId, {
      include: [
        { model: TabItem, as: 'tabItems' },
        { model: Venue, as: 'venue' }
      ]
    });

    if (!session) {
      return res.status(404).json({ 
        success: false, 
        error: 'Session not found' 
      });
    }

    res.json({
      success: true,
      session
    });
  } catch (error) {
    logger.error('Error fetching session:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch session' 
    });
  }
});

// Update session status (entry/exit detection)
router.patch('/:sessionId/status', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { status, entryTime, exitTime } = req.body;

    const session = await Session.findByPk(sessionId);
    if (!session) {
      return res.status(404).json({ 
        success: false, 
        error: 'Session not found' 
      });
    }

    const updateData = { status };
    if (entryTime) updateData.entryTime = entryTime;
    if (exitTime) updateData.exitTime = exitTime;

    await session.update(updateData);

    // Emit real-time update
    req.io.to(`session-${sessionId}`).emit('status-update', { status, entryTime, exitTime });
    req.io.to(`bartender-${session.venueId}`).emit('session-update', session);

    logger.info(`Session ${sessionId} status updated to ${status}`);

    res.json({
      success: true,
      session
    });
  } catch (error) {
    logger.error('Error updating session status:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update session status' 
    });
  }
});

// Add item to tab
router.post('/:sessionId/items', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { itemName, category, price, quantity = 1, addedBy, notes } = req.body;

    const session = await Session.findByPk(sessionId);
    if (!session) {
      return res.status(404).json({ 
        success: false, 
        error: 'Session not found' 
      });
    }

    const tabItem = await TabItem.create({
      sessionId,
      itemName,
      category,
      price,
      quantity,
      totalPrice: price * quantity,
      addedBy,
      notes
    });

    // Update session subtotal
    const allItems = await TabItem.findAll({ where: { sessionId } });
    const subtotal = allItems.reduce((sum, item) => sum + parseFloat(item.totalPrice), 0);
    await session.update({ subtotal, total: subtotal + parseFloat(session.tipAmount) });

    // Emit real-time updates
    req.io.to(`session-${sessionId}`).emit('item-added', tabItem);
    req.io.to(`bartender-${session.venueId}`).emit('tab-update', { sessionId, subtotal });

    logger.info(`Item added to session ${sessionId}: ${itemName} x${quantity}`);

    res.status(201).json({
      success: true,
      tabItem,
      subtotal
    });
  } catch (error) {
    logger.error('Error adding tab item:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to add item to tab' 
    });
  }
});

// Remove item from tab
router.delete('/:sessionId/items/:itemId', async (req, res) => {
  try {
    const { sessionId, itemId } = req.params;

    const session = await Session.findByPk(sessionId);
    if (!session) {
      return res.status(404).json({ 
        success: false, 
        error: 'Session not found' 
      });
    }

    const tabItem = await TabItem.findOne({ 
      where: { id: itemId, sessionId } 
    });

    if (!tabItem) {
      return res.status(404).json({ 
        success: false, 
        error: 'Tab item not found' 
      });
    }

    await tabItem.destroy();

    // Update session subtotal
    const allItems = await TabItem.findAll({ where: { sessionId } });
    const subtotal = allItems.reduce((sum, item) => sum + parseFloat(item.totalPrice), 0);
    await session.update({ subtotal, total: subtotal + parseFloat(session.tipAmount) });

    // Emit real-time updates
    req.io.to(`session-${sessionId}`).emit('item-removed', itemId);
    req.io.to(`bartender-${session.venueId}`).emit('tab-update', { sessionId, subtotal });

    res.json({
      success: true,
      subtotal
    });
  } catch (error) {
    logger.error('Error removing tab item:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to remove item from tab' 
    });
  }
});

// Get active sessions for bartender dashboard
router.get('/venue/:venueId/active', async (req, res) => {
  try {
    const { venueId } = req.params;

    const sessions = await Session.findAll({
      where: { 
        venueId,
        status: ['pending', 'active'] 
      },
      include: [
        { model: TabItem, as: 'tabItems' }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      sessions
    });
  } catch (error) {
    logger.error('Error fetching active sessions:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch active sessions' 
    });
  }
});

module.exports = router;