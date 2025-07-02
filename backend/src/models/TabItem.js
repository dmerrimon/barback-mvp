module.exports = (sequelize, DataTypes) => {
  const TabItem = sequelize.define('TabItem', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    sessionId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'sessions',
        key: 'id'
      }
    },
    itemName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      validate: {
        min: 1
      }
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    addedBy: {
      type: DataTypes.STRING,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'),
      defaultValue: 'confirmed'
    }
  }, {
    timestamps: true,
    tableName: 'tab_items',
    hooks: {
      beforeSave: (tabItem) => {
        tabItem.totalPrice = tabItem.price * tabItem.quantity;
      }
    }
  });

  TabItem.associate = (models) => {
    TabItem.belongsTo(models.Session, { foreignKey: 'sessionId', as: 'session' });
  };

  return TabItem;
};