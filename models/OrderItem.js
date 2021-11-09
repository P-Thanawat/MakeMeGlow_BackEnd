const { Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define(
    'OrderItem',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
      },
      quality: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    { tableName: 'order_items', underscored: true }
  );

  OrderItem.associate = (models) => {
    OrderItem.belongsTo(models.Order, {
      foreignKey: {
        name: 'orderId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
    OrderItem.belongsTo(models.Product, {
      foreignKey: {
        name: 'productId',
        allowNull: false,
      },
      onDelete: 'CASCADE',
      onUpdate: 'RESTRICT',
    });
  };

  return OrderItem;
};
