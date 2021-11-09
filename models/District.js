const { Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const District = sequelize.define(
    'District',
    {
      name: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING(6),
        allowNull: false,
      },
    },
    { tableName: 'district', underscored: true, timestamps: false }
  );

  District.associate = (models) => {
    District.belongsTo(models.Geography, {
      foreignKey: {
        name: 'geoId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
    District.belongsTo(models.Province, {
      foreignKey: {
        name: 'provinceId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
    District.belongsTo(models.Amphur, {
      foreignKey: {
        name: 'amphurId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
  };

  return District;
};
