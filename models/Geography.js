const { Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Geography = sequelize.define(
    'Geography',
    {
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    { tableName: 'geography', underscored: true, timestamps: false }
  );

  Geography.associate = (models) => {
    Geography.hasMany(models.Amphur, {
      foreignKey: {
        name: 'geoId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
    Geography.hasMany(models.Province, {
      foreignKey: {
        name: 'geoId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
    Geography.hasMany(models.District, {
      foreignKey: {
        name: 'geoId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
  };

  return Geography;
};
