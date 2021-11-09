const { Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    'Product',
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
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: false,
      },
      cetagory: {
        type: DataTypes.STRING,
        allowNUll: false,
      },
      colorName: {
        type: DataTypes.STRING,
      },
      color: {
        type: DataTypes.STRING,
      },
      countStock: {
        type: DataTypes.STRING,
        allowNUll: false,
      },
      ingredient: {
        type: DataTypes.TEXT,
        allowNUll: false,
      },
    },
    { tableName: 'products', underscored: true }
  );

  Product.associate = (models) => {
    Product.hasMany(models.OrderItem, {
      foreignKey: {
        name: 'productId',
        allowNull: false,
      },
      onDelete: 'CASCADE',
      onUpdate: 'RESTRICT',
    });
    Product.hasMany(models.CartItem, {
      foreignKey: {
        name: 'productId',
        allowNull: false,
      },
      onDelete: 'CASCADE',
      onUpdate: 'RESTRICT',
    });
    Product.hasMany(models.FavoriteProduct, {
      foreignKey: {
        name: 'productId',
        allowNull: false,
      },
      onDelete: 'CASCADE',
      onUpdate: 'RESTRICT',
    });
    Product.hasMany(models.ProductImage, {
      foreignKey: {
        name: 'productId',
        allowNull: false,
      },
      onDelete: 'CASCADE',
      onUpdate: 'RESTRICT',
    });
  };

  return Product;
};
