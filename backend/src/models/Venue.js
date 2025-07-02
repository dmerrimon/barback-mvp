module.exports = (sequelize, DataTypes) => {
  const Venue = sequelize.define('Venue', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true
      }
    },
    stripeAccountId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    settings: {
      type: DataTypes.JSONB,
      defaultValue: {
        autoCloseTabMinutes: 30,
        tipSuggestions: [15, 18, 20, 25],
        requireTipBeforeClose: false,
        maxTabAmount: 500,
        beaconExitDelaySeconds: 10
      }
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    subscriptionTier: {
      type: DataTypes.ENUM('basic', 'premium'),
      defaultValue: 'basic'
    }
  }, {
    timestamps: true,
    tableName: 'venues'
  });

  Venue.associate = (models) => {
    Venue.hasMany(models.Session, { foreignKey: 'venueId', as: 'sessions' });
    Venue.hasMany(models.Beacon, { foreignKey: 'venueId', as: 'beacons' });
    Venue.hasMany(models.Zone, { foreignKey: 'venueId', as: 'zones' });
    Venue.hasMany(models.Analytics, { foreignKey: 'venueId', as: 'analytics' });
  };

  return Venue;
};