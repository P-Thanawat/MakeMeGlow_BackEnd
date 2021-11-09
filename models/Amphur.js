const { Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Amphur = sequelize.define(
    'Amphur',
    {
      name: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      postalCode: { type: DataTypes.STRING(5), allowNull: false },
      code: { type: DataTypes.STRING(4), allowNull: false },
    },
    { tableName: 'amphur', underscored: true, timestamps: false }
  );

  Amphur.associate = (models) => {
    Amphur.belongsTo(models.Geography, {
      foreignKey: {
        name: 'geoId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
    Amphur.belongsTo(models.Province, {
      foreignKey: {
        name: 'provinceId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
    Amphur.hasMany(models.District, {
      foreignKey: {
        name: 'amphurId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
  };

  return Amphur;
};
