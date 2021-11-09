const { Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    'Order',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
      },
      omiseCreatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      cardId: {
        type: DataTypes.STRING,
      },
      sourceId: DataTypes.STRING,
      chargeId: DataTypes.STRING,
      amount: DataTypes.DECIMAL(8, 2),
      status: DataTypes.ENUM('successful', 'failed'),
      paidAt: DataTypes.DATE,
      expiresAt: DataTypes.DATE,
      shippingStatus: DataTypes.ENUM('To Ship', 'Delivery'),
      shippingTrackingId: DataTypes.STRING,
    },
    { tableName: 'orders', underscored: true }
  );

  Order.associate = (models) => {
    Order.belongsTo(models.Address, {
      foreignKey: {
        name: 'addressId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
    Order.hasMany(models.OrderItem, {
      foreignKey: {
        name: 'orderId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
  };

  return Order;
};
