const { Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const ProductImage = sequelize.define(
    'ProductImage',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { tableName: 'product_images', underscored: true }
  );

  ProductImage.associate = (models) => {
    ProductImage.belongsTo(models.Product, {
      foreignKey: {
        name: 'productId',
        allowNull: false,
      },
      onDelete: 'CASCADE',
      onUpdate: 'RESTRICT',
    });
  };
  return ProductImage;
};
