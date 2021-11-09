const { Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Province = sequelize.define(
    'Province',
    {
      name: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING(2),
        allowNull: false,
      },
    },
    { tableName: 'province', underscored: true, timestamps: false }
  );

  Province.associate = (models) => {
    Province.belongsTo(models.Geography, {
      foreignKey: {
        name: 'geoId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
    Province.hasMany(models.Amphur, {
      foreignKey: {
        name: 'provinceId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
    Province.hasMany(models.District, {
      foreignKey: {
        name: 'provinceId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
  };

  return Province;
};
