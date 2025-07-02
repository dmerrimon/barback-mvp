module.exports = (sequelize, DataTypes) => {
  const Analytics = sequelize.define('Analytics', {
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
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    totalSessions: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    totalRevenue: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    totalTips: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    averageTabSize: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    averageDwellTime: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Average dwell time in minutes'
    },
    uniquePatrons: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    tipConversionRate: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0,
      comment: 'Percentage of sessions that included tips'
    },
    peakHour: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Hour of day with most activity (0-23)'
    },
    zoneActivity: {
      type: DataTypes.JSONB,
      defaultValue: {},
      comment: 'Activity breakdown by zone'
    },
    hourlyBreakdown: {
      type: DataTypes.JSONB,
      defaultValue: {},
      comment: 'Sessions and revenue by hour'
    },
    paymentMethods: {
      type: DataTypes.JSONB,
      defaultValue: {},
      comment: 'Breakdown of payment methods used'
    }
  }, {
    timestamps: true,
    tableName: 'analytics',
    indexes: [
      {
        unique: true,
        fields: ['venueId', 'date']
      },
      {
        fields: ['date']
      }
    ]
  });

  Analytics.associate = (models) => {
    Analytics.belongsTo(models.Venue, { foreignKey: 'venueId', as: 'venue' });
  };

  return Analytics;
};