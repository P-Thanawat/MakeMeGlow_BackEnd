const { Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const ResetPassword = sequelize.define(
    'ResetPassword',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
      },
      resetToken: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      expireToken: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    { tableName: 'reset_passwords', underscored: true }
  );

  ResetPassword.associate = (models) => {
    ResetPassword.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
  };

  return ResetPassword;
};
