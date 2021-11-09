const { Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const CreditCard = sequelize.define(
    'CreditCard',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
      },
      customerId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { tableName: 'credit_cards', underscored: true }
  );

  CreditCard.associate = (models) => {
    CreditCard.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
  };

  return CreditCard;
};
