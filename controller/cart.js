const { Cart, CartItem, Sequelize, Product, ProductImage } = require('../models');

exports.getAllCartItem = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({
      where: { userId: userId },
      include: { model: CartItem, include: { model: Product, include: { model: ProductImage } } },
    });
    const carts = cart.dataValues.CartItems.map((item) => {
      const clone1 = JSON.parse(JSON.stringify(item));
      delete clone1.Product;
      const { Product } = JSON.parse(JSON.stringify(item));
      const clone = { ...Product };
      delete clone.ProductImages;
      return { ...clone, imageUrl: Product.ProductImages[0].imageUrl, ...clone1 };
    });
    res.status(201).json({ carts: carts, countCart: carts.length });
  } catch (err) {
    next(err);
  }
};

exports.addCartItem = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { quality, productId } = req.body;
    const cart = await Cart.findOne({ where: { userId: userId } });
    const cartItem = await CartItem.create({ cartId: cart.id, productId, quality });
    const product = await Product.findOne({ where: { id: productId }, include: { model: ProductImage } });
    const clone = { ...JSON.parse(JSON.stringify(product)) };
    const imageUrl = clone.ProductImages[0].imageUrl;
    delete clone.ProductImages;
    res.status(200).json({ cartItem: { ...clone, imageUrl: imageUrl, ...JSON.parse(JSON.stringify(cartItem)) } });
  } catch (err) {
    next(err);
  }
};

exports.updateCartItemById = async (req, res, next) => {
  try {
    const { cartItemId } = req.params;
    const { quality } = req.body;
    const cartItem = await CartItem.findByPk(cartItemId);
    cartItem.quality = quality;
    cartItem.save();
    res.status(200).json({ cartItem });
  } catch (err) {
    next(err);
  }
};

exports.deleteCartItemById = async (req, res, next) => {
  try {
    const { cartItemId } = req.params;
    await CartItem.destroy({ where: { id: cartItemId } });
    res.status(204).json();
  } catch (err) {
    next(err);
  }
};
