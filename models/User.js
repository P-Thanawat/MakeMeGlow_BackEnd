const { Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
      },
      role: {
        type: DataTypes.ENUM('ADMIN', 'CUSTOMER'),
        allowNull: false,
        defaultValue: 'CUSTOMER',
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phoneNumber: {
        type: DataTypes.STRING,
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      imageUrl: {
        type: DataTypes.STRING,
      },
      facebookId: {
        type: DataTypes.STRING,
      },
      googleId: {
        type: DataTypes.STRING,
      },
    },
    { tableName: 'users', underscored: true }
  );

  User.associate = (models) => {
    User.hasOne(models.Cart, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
    User.hasMany(models.Address, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
    User.hasOne(models.CreditCard, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
    User.hasOne(models.ResetPassword, {
      foreignKey: {
        name: 'userId',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
  };

  return User;
};
