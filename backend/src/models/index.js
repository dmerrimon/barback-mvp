const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// Import models
const Venue = require('./Venue');
const Session = require('./Session');
const TabItem = require('./TabItem');
const Payment = require('./Payment');
const Beacon = require('./Beacon');
const Zone = require('./Zone');
const Analytics = require('./Analytics');

// Initialize models
const models = {
  Venue: Venue(sequelize, DataTypes),
  Session: Session(sequelize, DataTypes),
  TabItem: TabItem(sequelize, DataTypes),
  Payment: Payment(sequelize, DataTypes),
  Beacon: Beacon(sequelize, DataTypes),
  Zone: Zone(sequelize, DataTypes),
  Analytics: Analytics(sequelize, DataTypes)
};

// Define associations
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

// Sync models with database
if (process.env.NODE_ENV === 'development') {
  sequelize.sync({ alter: true });
}

module.exports = {
  sequelize,
  ...models
};