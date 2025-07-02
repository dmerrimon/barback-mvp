module.exports = (sequelize, DataTypes) => {
  const Session = sequelize.define('Session', {
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
    patronName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    patronPhone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    patronEmail: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true
      }
    },
    status: {
      type: DataTypes.ENUM('pending', 'active', 'closed', 'cancelled'),
      defaultValue: 'pending'
    },
    qrCode: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    tableNumber: {
      type: DataTypes.STRING,
      allowNull: true
    },
    entryTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    exitTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    tipAmount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    stripePaymentIntentId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {}
    }
  }, {
    timestamps: true,
    tableName: 'sessions'
  });

  Session.associate = (models) => {
    Session.belongsTo(models.Venue, { foreignKey: 'venueId', as: 'venue' });
    Session.hasMany(models.TabItem, { foreignKey: 'sessionId', as: 'tabItems' });
    Session.hasMany(models.Payment, { foreignKey: 'sessionId', as: 'payments' });
  };

  return Session;
};