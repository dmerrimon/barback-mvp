module.exports = (sequelize, DataTypes) => {
  const Beacon = sequelize.define('Beacon', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    venueId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'venues',
        key: 'id'
      }
    },
    uuid: {
      type: DataTypes.STRING,
      allowNull: false
    },
    major: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    minor: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    location: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Store x, y coordinates or lat/lng'
    },
    rssiThreshold: {
      type: DataTypes.INTEGER,
      defaultValue: -65,
      comment: 'RSSI threshold for proximity detection'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    batteryLevel: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0,
        max: 100
      }
    },
    lastSeen: {
      type: DataTypes.DATE,
      allowNull: true
    },
    settings: {
      type: DataTypes.JSONB,
      defaultValue: {
        transmissionPower: 'medium',
        advertisingInterval: 100
      }
    }
  }, {
    timestamps: true,
    tableName: 'beacons',
    indexes: [
      {
        unique: true,
        fields: ['uuid', 'major', 'minor']
      }
    ]
  });

  Beacon.associate = (models) => {
    Beacon.belongsTo(models.Venue, { foreignKey: 'venueId', as: 'venue' });
    Beacon.belongsToMany(models.Zone, { 
      through: 'ZoneBeacons', 
      foreignKey: 'beaconId',
      as: 'zones'
    });
  };

  return Beacon;
};