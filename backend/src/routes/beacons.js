const express = require('express');
const router = express.Router();
const { Beacon, Zone, Venue } = require('../models');
const { validateBeacon, validateZone } = require('../middleware/validation');
const logger = require('../utils/logger');

// Get all beacons for a venue
router.get('/venue/:venueId', async (req, res) => {
  try {
    const { venueId } = req.params;

    const beacons = await Beacon.findAll({
      where: { venueId },
      include: [
        {
          model: Zone,
          as: 'zones',
          through: { attributes: [] }
        }
      ],
      order: [['name', 'ASC']]
    });

    res.json({
      success: true,
      beacons
    });

  } catch (error) {
    logger.error('Error fetching beacons:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch beacons'
    });
  }
});

// Create new beacon
router.post('/', validateBeacon, async (req, res) => {
  try {
    const {
      venueId,
      uuid,
      major,
      minor,
      name,
      description,
      location,
      rssiThreshold
    } = req.body;

    // Check if venue exists
    const venue = await Venue.findByPk(venueId);
    if (!venue) {
      return res.status(404).json({
        success: false,
        error: 'Venue not found'
      });
    }

    // Check for duplicate beacon (uuid + major + minor must be unique)
    const existingBeacon = await Beacon.findOne({
      where: { uuid, major, minor }
    });

    if (existingBeacon) {
      return res.status(400).json({
        success: false,
        error: 'Beacon with this UUID, major, and minor already exists'
      });
    }

    const beacon = await Beacon.create({
      venueId,
      uuid,
      major,
      minor,
      name,
      description,
      location,
      rssiThreshold: rssiThreshold || -65
    });

    logger.info(`New beacon created: ${beacon.id} - ${name}`);

    res.status(201).json({
      success: true,
      beacon
    });

  } catch (error) {
    logger.error('Error creating beacon:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create beacon'
    });
  }
});

// Update beacon
router.patch('/:beaconId', async (req, res) => {
  try {
    const { beaconId } = req.params;
    const updates = req.body;

    const beacon = await Beacon.findByPk(beaconId);
    if (!beacon) {
      return res.status(404).json({
        success: false,
        error: 'Beacon not found'
      });
    }

    // If updating UUID/major/minor, check for duplicates
    if (updates.uuid || updates.major || updates.minor) {
      const checkUuid = updates.uuid || beacon.uuid;
      const checkMajor = updates.major || beacon.major;
      const checkMinor = updates.minor || beacon.minor;

      const existingBeacon = await Beacon.findOne({
        where: {
          uuid: checkUuid,
          major: checkMajor,
          minor: checkMinor,
          id: { [require('sequelize').Op.ne]: beaconId }
        }
      });

      if (existingBeacon) {
        return res.status(400).json({
          success: false,
          error: 'Another beacon with this UUID, major, and minor already exists'
        });
      }
    }

    await beacon.update(updates);

    logger.info(`Beacon updated: ${beaconId}`);

    res.json({
      success: true,
      beacon
    });

  } catch (error) {
    logger.error('Error updating beacon:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update beacon'
    });
  }
});

// Delete beacon
router.delete('/:beaconId', async (req, res) => {
  try {
    const { beaconId } = req.params;

    const beacon = await Beacon.findByPk(beaconId);
    if (!beacon) {
      return res.status(404).json({
        success: false,
        error: 'Beacon not found'
      });
    }

    await beacon.destroy();

    logger.info(`Beacon deleted: ${beaconId}`);

    res.json({
      success: true,
      message: 'Beacon deleted successfully'
    });

  } catch (error) {
    logger.error('Error deleting beacon:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete beacon'
    });
  }
});

// Handle beacon detection from clients
router.post('/detect', async (req, res) => {
  try {
    const {
      sessionId,
      beaconId,
      uuid,
      major,
      minor,
      rssi,
      action, // 'enter' or 'exit'
      timestamp
    } = req.body;

    // Find the beacon
    let beacon;
    if (beaconId) {
      beacon = await Beacon.findByPk(beaconId);
    } else if (uuid && major !== undefined && minor !== undefined) {
      beacon = await Beacon.findOne({
        where: { uuid, major, minor }
      });
    }

    if (!beacon) {
      return res.status(404).json({
        success: false,
        error: 'Beacon not found'
      });
    }

    // Get associated zones
    const zones = await Zone.findAll({
      include: [
        {
          model: Beacon,
          as: 'beacons',
          where: { id: beacon.id },
          through: { attributes: [] }
        }
      ]
    });

    // Process zone triggers based on action
    const triggers = [];
    for (const zone of zones) {
      if (action === 'enter' && ['activate_tab', 'notification'].includes(zone.triggerAction)) {
        triggers.push({
          zoneId: zone.id,
          zoneName: zone.name,
          action: zone.triggerAction,
          type: zone.type
        });
      } else if (action === 'exit' && zone.triggerAction === 'close_tab') {
        triggers.push({
          zoneId: zone.id,
          zoneName: zone.name,
          action: zone.triggerAction,
          type: zone.type
        });
      }
    }

    // Update beacon last seen
    await beacon.update({ lastSeen: new Date(timestamp || Date.now()) });

    // Emit real-time update
    req.io.to(`session-${sessionId}`).emit('beacon-detection', {
      beaconId: beacon.id,
      beaconName: beacon.name,
      action,
      rssi,
      zones: zones.map(z => ({ id: z.id, name: z.name, type: z.type })),
      triggers
    });

    // Also emit to bartender dashboard
    req.io.to(`bartender-${beacon.venueId}`).emit('patron-movement', {
      sessionId,
      beaconName: beacon.name,
      action,
      zones: zones.map(z => z.name),
      timestamp: timestamp || Date.now()
    });

    logger.info(`Beacon detection: ${beacon.name} - ${action} (RSSI: ${rssi})`);

    res.json({
      success: true,
      beacon: {
        id: beacon.id,
        name: beacon.name
      },
      zones: zones.map(zone => ({
        id: zone.id,
        name: zone.name,
        type: zone.type
      })),
      triggers,
      action
    });

  } catch (error) {
    logger.error('Error processing beacon detection:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process beacon detection'
    });
  }
});

// Get all zones for a venue
router.get('/zones/venue/:venueId', async (req, res) => {
  try {
    const { venueId } = req.params;

    const zones = await Zone.findAll({
      where: { venueId },
      include: [
        {
          model: Beacon,
          as: 'beacons',
          through: { attributes: [] }
        }
      ],
      order: [['priority', 'DESC'], ['name', 'ASC']]
    });

    res.json({
      success: true,
      zones
    });

  } catch (error) {
    logger.error('Error fetching zones:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch zones'
    });
  }
});

// Create new zone
router.post('/zones', validateZone, async (req, res) => {
  try {
    const {
      venueId,
      name,
      type,
      description,
      coordinates,
      triggerAction,
      dwellTimeThreshold,
      priority,
      beaconIds = []
    } = req.body;

    // Check if venue exists
    const venue = await Venue.findByPk(venueId);
    if (!venue) {
      return res.status(404).json({
        success: false,
        error: 'Venue not found'
      });
    }

    const zone = await Zone.create({
      venueId,
      name,
      type,
      description,
      coordinates,
      triggerAction: triggerAction || 'none',
      dwellTimeThreshold: dwellTimeThreshold || 10,
      priority: priority || 1
    });

    // Associate beacons if provided
    if (beaconIds.length > 0) {
      const beacons = await Beacon.findAll({
        where: {
          id: beaconIds,
          venueId // Ensure beacons belong to the same venue
        }
      });
      await zone.setBeacons(beacons);
    }

    logger.info(`New zone created: ${zone.id} - ${name}`);

    res.status(201).json({
      success: true,
      zone
    });

  } catch (error) {
    logger.error('Error creating zone:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create zone'
    });
  }
});

// Update zone
router.patch('/zones/:zoneId', async (req, res) => {
  try {
    const { zoneId } = req.params;
    const updates = req.body;

    const zone = await Zone.findByPk(zoneId);
    if (!zone) {
      return res.status(404).json({
        success: false,
        error: 'Zone not found'
      });
    }

    // Handle beacon associations
    if (updates.beaconIds) {
      const beacons = await Beacon.findAll({
        where: {
          id: updates.beaconIds,
          venueId: zone.venueId
        }
      });
      await zone.setBeacons(beacons);
      delete updates.beaconIds;
    }

    await zone.update(updates);

    logger.info(`Zone updated: ${zoneId}`);

    res.json({
      success: true,
      zone
    });

  } catch (error) {
    logger.error('Error updating zone:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update zone'
    });
  }
});

// Delete zone
router.delete('/zones/:zoneId', async (req, res) => {
  try {
    const { zoneId } = req.params;

    const zone = await Zone.findByPk(zoneId);
    if (!zone) {
      return res.status(404).json({
        success: false,
        error: 'Zone not found'
      });
    }

    await zone.destroy();

    logger.info(`Zone deleted: ${zoneId}`);

    res.json({
      success: true,
      message: 'Zone deleted successfully'
    });

  } catch (error) {
    logger.error('Error deleting zone:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete zone'
    });
  }
});

module.exports = router;