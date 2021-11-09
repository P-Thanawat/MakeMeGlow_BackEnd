const { Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const FavoriteProduct = sequelize.define(
    'FavoriteProduct',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { tableName: 'favorite_products', underscored: true }
  );

  FavoriteProduct.associate = (models) => {
    FavoriteProduct.belongsTo(models.Product, {
      foreignKey: {
        name: 'productId',
        allowNull: false,
      },
      onDelete: 'CASCADE',
      onUpdate: 'RESTRICT',
    });
    FavoriteProduct.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
  };

  return FavoriteProduct;
};
