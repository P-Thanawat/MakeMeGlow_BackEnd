const { Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const Address = sequelize.define(
    'Address',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address1: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address2: {
        type: DataTypes.STRING,
      },
      subDistrict: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      district: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      province: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      postalCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { tableName: 'addresses', underscored: true, paranoid: true }
  );

  Address.associate = (models) => {
    Address.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
    Address.hasMany(models.Order, {
      foreignKey: {
        name: 'addressId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
  };

  return Address;
};
