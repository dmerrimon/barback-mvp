const { Venue, Session, TabItem, Payment, Beacon, Zone, Analytics } = require('../backend/src/models');
const { v4: uuidv4 } = require('uuid');

async function seedDatabase() {
  console.log('🌱 Seeding database with sample data...');

  try {
    // Create demo venue
    const venue = await Venue.create({
      id: 'demo-venue-id',
      name: 'The Digital Tap',
      address: '123 Tech Street, San Francisco, CA 94105',
      phone: '+1 (555) 123-4567',
      email: 'contact@digitaltap.com',
      subscriptionTier: 'premium',
      settings: {
        autoCloseTabMinutes: 30,
        tipSuggestions: [15, 18, 20, 25],
        requireTipBeforeClose: false,
        maxTabAmount: 500,
        beaconExitDelaySeconds: 10
      }
    });

    console.log('✓ Created demo venue');

    // Create beacons
    const beacons = await Promise.all([
      Beacon.create({
        venueId: venue.id,
        uuid: 'E2C56DB5-DFFB-48D2-B060-D0F5A71096E0',
        major: 1,
        minor: 1,
        name: 'Entry Zone Beacon',
        description: 'Beacon at main entrance',
        rssiThreshold: -65,
        location: { x: 0, y: 0, description: 'Main entrance' }
      }),
      Beacon.create({
        venueId: venue.id,
        uuid: 'E2C56DB5-DFFB-48D2-B060-D0F5A71096E0',
        major: 1,
        minor: 2,
        name: 'Bar Zone Beacon',
        description: 'Beacon at bar area',
        rssiThreshold: -65,
        location: { x: 10, y: 5, description: 'Bar counter' }
      }),
      Beacon.create({
        venueId: venue.id,
        uuid: 'E2C56DB5-DFFB-48D2-B060-D0F5A71096E0',
        major: 1,
        minor: 3,
        name: 'Exit Zone Beacon',
        description: 'Beacon at exit',
        rssiThreshold: -65,
        location: { x: 0, y: 10, description: 'Main exit' }
      })
    ]);

    console.log('✓ Created beacons');

    // Create zones
    const zones = await Promise.all([
      Zone.create({
        venueId: venue.id,
        name: 'Main Entrance',
        type: 'entry',
        triggerAction: 'activate_tab',
        description: 'Main entrance area for tab activation',
        priority: 3
      }),
      Zone.create({
        venueId: venue.id,
        name: 'Bar Area',
        type: 'bar',
        triggerAction: 'notification',
        description: 'Bar counter and seating area',
        priority: 2
      }),
      Zone.create({
        venueId: venue.id,
        name: 'Exit Area',
        type: 'exit',
        triggerAction: 'close_tab',
        description: 'Exit area for automatic tab closure',
        priority: 3
      })
    ]);

    console.log('✓ Created zones');

    // Associate beacons with zones
    await zones[0].setBeacons([beacons[0]]); // Entry zone with entry beacon
    await zones[1].setBeacons([beacons[1]]); // Bar zone with bar beacon
    await zones[2].setBeacons([beacons[2]]); // Exit zone with exit beacon

    console.log('✓ Associated beacons with zones');

    // Create sample sessions
    const sessions = [];
    const sessionData = [
      {
        patronName: 'John Doe',
        patronPhone: '+1 (555) 123-4567',
        patronEmail: 'john@example.com',
        tableNumber: '5',
        status: 'active',
        entryTime: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        items: [
          { name: 'Craft IPA', category: 'Beer', price: 8.50, quantity: 2 },
          { name: 'Buffalo Wings', category: 'Food', price: 12.50, quantity: 1 }
        ]
      },
      {
        patronName: 'Jane Smith',
        patronPhone: '+1 (555) 987-6543',
        patronEmail: 'jane@example.com',
        tableNumber: '3',
        status: 'pending',
        entryTime: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        items: []
      },
      {
        patronName: 'Mike Johnson',
        patronEmail: 'mike@example.com',
        tableNumber: '7',
        status: 'closed',
        entryTime: new Date(Date.now() - 90 * 60 * 1000), // 90 minutes ago
        exitTime: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
        items: [
          { name: 'Old Fashioned', category: 'Cocktails', price: 12.00, quantity: 2 },
          { name: 'Loaded Nachos', category: 'Food', price: 11.75, quantity: 1 },
          { name: 'Premium Lager', category: 'Beer', price: 7.00, quantity: 1 }
        ]
      }
    ];

    for (const sessionInfo of sessionData) {
      const session = await Session.create({
        venueId: venue.id,
        patronName: sessionInfo.patronName,
        patronPhone: sessionInfo.patronPhone,
        patronEmail: sessionInfo.patronEmail,
        tableNumber: sessionInfo.tableNumber,
        status: sessionInfo.status,
        qrCode: `http://localhost:3000/session/${uuidv4()}`,
        entryTime: sessionInfo.entryTime,
        exitTime: sessionInfo.exitTime,
        subtotal: 0,
        tipAmount: 0,
        total: 0
      });

      // Add tab items
      let subtotal = 0;
      for (const item of sessionInfo.items) {
        const totalPrice = item.price * item.quantity;
        await TabItem.create({
          sessionId: session.id,
          itemName: item.name,
          category: item.category,
          price: item.price,
          quantity: item.quantity,
          totalPrice: totalPrice,
          addedBy: 'Demo Staff'
        });
        subtotal += totalPrice;
      }

      // Update session totals
      const tipAmount = sessionInfo.status === 'closed' ? subtotal * 0.18 : 0; // 18% tip for closed sessions
      const total = subtotal + tipAmount;

      await session.update({
        subtotal: Math.round(subtotal * 100) / 100,
        tipAmount: Math.round(tipAmount * 100) / 100,
        total: Math.round(total * 100) / 100
      });

      // Create payment for closed sessions
      if (sessionInfo.status === 'closed') {
        await Payment.create({
          sessionId: session.id,
          stripePaymentIntentId: `pi_demo_${uuidv4().replace(/-/g, '')}`,
          stripeCustomerId: `cus_demo_${uuidv4().substring(0, 8)}`,
          amount: subtotal,
          tipAmount: tipAmount,
          totalAmount: total,
          status: 'succeeded',
          paymentMethod: 'card_demo',
          last4: '4242',
          brand: 'visa',
          metadata: {
            demo: true
          }
        });
      }

      sessions.push(session);
    }

    console.log('✓ Created sample sessions with tab items');

    // Create sample analytics data for the past 30 days
    const analyticsData = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      // Generate realistic sample data
      const baseSessions = Math.floor(Math.random() * 20) + 15; // 15-35 sessions
      const baseRevenue = baseSessions * (Math.random() * 30 + 20); // $20-50 average tab
      const tips = baseRevenue * (Math.random() * 0.1 + 0.15); // 15-25% tips

      const analytics = await Analytics.create({
        venueId: venue.id,
        date: dateStr,
        totalSessions: baseSessions,
        totalRevenue: Math.round(baseRevenue * 100) / 100,
        totalTips: Math.round(tips * 100) / 100,
        averageTabSize: Math.round((baseRevenue / baseSessions) * 100) / 100,
        averageDwellTime: Math.floor(Math.random() * 60) + 45, // 45-105 minutes
        uniquePatrons: Math.floor(baseSessions * 0.8), // Assume 80% unique
        tipConversionRate: Math.round((Math.random() * 20 + 70) * 100) / 100, // 70-90%
        peakHour: Math.floor(Math.random() * 6) + 18, // 6PM-11PM
        hourlyBreakdown: generateHourlyBreakdown(baseSessions),
        zoneActivity: {
          [zones[0].id]: { entries: baseSessions, avgDwellTime: 2 },
          [zones[1].id]: { entries: Math.floor(baseSessions * 0.9), avgDwellTime: 45 },
          [zones[2].id]: { entries: Math.floor(baseSessions * 0.85), avgDwellTime: 1 }
        },
        paymentMethods: {
          visa: Math.floor(baseSessions * 0.4),
          mastercard: Math.floor(baseSessions * 0.3),
          amex: Math.floor(baseSessions * 0.2),
          other: Math.floor(baseSessions * 0.1)
        }
      });

      analyticsData.push(analytics);
    }

    console.log('✓ Created sample analytics data for 30 days');

    console.log('🎉 Database seeding completed successfully!');
    console.log(`
Demo data created:
- Venue: ${venue.name}
- Beacons: ${beacons.length}
- Zones: ${zones.length}
- Sessions: ${sessions.length}
- Analytics records: ${analyticsData.length}

You can now start the application and test with:
- Venue ID: ${venue.id}
- Bartender Dashboard: http://localhost:3000/bartender/${venue.id}
- Owner Dashboard: http://localhost:3000/owner/${venue.id}
    `);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

function generateHourlyBreakdown(totalSessions) {
  const breakdown = {};
  const distribution = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 0-10 AM
    0.02, 0.05, 0.08, 0.05, 0.03, 0.02, // 11 AM - 4 PM
    0.12, 0.18, 0.22, 0.15, 0.08, 0.05, // 5 PM - 10 PM
    0, 0 // 11 PM - 12 AM
  ];

  for (let hour = 0; hour < 24; hour++) {
    const sessions = Math.floor(totalSessions * distribution[hour]);
    const revenue = sessions * (Math.random() * 15 + 25); // $25-40 average per session
    breakdown[hour] = {
      sessions,
      revenue: Math.round(revenue * 100) / 100
    };
  }

  return breakdown;
}

// Run seeding if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('✅ Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedDatabase };