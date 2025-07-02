module.exports = (sequelize, DataTypes) => {
  const Zone = sequelize.define('Zone', {
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
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('entry', 'exit', 'bar', 'seating', 'other'),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    coordinates: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Polygon coordinates defining the zone boundary'
    },
    triggerAction: {
      type: DataTypes.ENUM('activate_tab', 'close_tab', 'notification', 'none'),
      defaultValue: 'none'
    },
    dwellTimeThreshold: {
      type: DataTypes.INTEGER,
      defaultValue: 10,
      comment: 'Seconds required in zone before triggering action'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    priority: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      comment: 'Higher priority zones override lower priority ones'
    },
    settings: {
      type: DataTypes.JSONB,
      defaultValue: {
        requireConfirmation: false,
        sendNotification: true,
        maxOccupancy: null
      }
    }
  }, {
    timestamps: true,
    tableName: 'zones'
  });

  Zone.associate = (models) => {
    Zone.belongsTo(models.Venue, { foreignKey: 'venueId', as: 'venue' });
    Zone.belongsToMany(models.Beacon, { 
      through: 'ZoneBeacons', 
      foreignKey: 'zoneId',
      as: 'beacons'
    });
  };

  return Zone;
};