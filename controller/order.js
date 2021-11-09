const {
  Address,
  Order,
  CreditCard,
  OrderItem,
  Product,
  CartItem,
  ProductImage,
  User,
  Sequelize,
} = require('../models');
const { addCreditCard, createCharge, deleteCreditCard } = require('../util/omise');
const { Op } = require('sequelize');

const processAfterCreateCharge = (charge, orders, customer) => {};

exports.createOrderWithAddressAndCard = async (req, res, ncartIdext) => {
  try {
    const userId = req.user.id;
    const { addressCreate, creditCardToken, amount, orders, cartId } = req.body;
    const address = await Address.create({ ...addressCreate, userId });
    const creditCard = await CreditCard.findOne({ where: { userId } });
    const customer = await addCreditCard(creditCard.customerId, creditCardToken);
    const charge = await createCharge(customer.id, customer.default_card, amount);
    if (charge.status === 'successful') {
      const order = await Order.create({
        omiseCreatedAt: charge.created_at,
        cardId: charge.card.id,
        sourceId: null,
        chargeId: charge.id,
        amount: charge.amount / 100,
        status: 'successful',
        paidAt: charge.paid_at,
        expiresAt: charge.expired_at,
        shippingStatus: 'To Ship',
        shippingTrackingId: '',
        addressId: address.id,
      });

      // Update Stock
      orders.forEach(async (product) => {
        const { productId, quality } = product;
        const productUpdate = await Product.findOne({ where: { id: productId } });
        productUpdate.countStock = +productUpdate.countStock - +quality;
        productUpdate.save();
      });

      await CartItem.destroy({ where: { cartId: cartId } });

      const orderItemCreate = orders.map((product) => {
        const { productId, quality } = product;
        return {
          productId: productId,
          quality: quality,
          orderId: order.id,
        };
      });

      await OrderItem.bulkCreate(orderItemCreate);
      return res.status(200).json({ charge, order });
    } else {
      await deleteCreditCard(customer.id, customer.default_card);
    }
    res.status(200).json({ charge });
  } catch (err) {
    next(err);
  }
};

exports.createOrderWithCardAndAddressId = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { addressId, creditCardToken, amount, orders, cartId } = req.body;
    const creditCard = await CreditCard.findOne({ where: { userId } });
    const customer = await addCreditCard(creditCard.customerId, creditCardToken);
    const charge = await createCharge(customer.id, customer.default_card, amount);
    if (charge.status === 'successful') {
      const order = await Order.create({
        omiseCreatedAt: charge.created_at,
        cardId: charge.card.id,
        sourceId: null,
        chargeId: charge.id,
        amount: charge.amount / 100,
        status: 'successful',
        paidAt: charge.paid_at,
        expiresAt: charge.expired_at,
        shippingStatus: 'To Ship',
        shippingTrackingId: '',
        addressId: addressId,
      });

      // Update Stock
      orders.forEach(async (product) => {
        const { productId, quality } = product;
        const productUpdate = await Product.findOne({ where: { id: productId } });
        productUpdate.countStock = +productUpdate.countStock - +quality;
        productUpdate.save();
      });

      const orderItemCreate = orders.map((product) => {
        const { productId, quality } = product;
        return {
          productId: productId,
          quality: quality,
          orderId: order.id,
        };
      });

      await CartItem.destroy({ where: { cartId: cartId } });

      await OrderItem.bulkCreate(orderItemCreate);
      return res.status(200).json({ charge, order });
    } else {
      await deleteCreditCard(customer.id, customer.default_card);
    }
    res.status(200).json({ charge });
  } catch (err) {
    next(err);
  }
};

exports.createOrderWithCardIdAndAddress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { addressCreate, creditCardId, amount, orders, cartId } = req.body;
    const address = await Address.create({ ...addressCreate, userId });
    const customer = await CreditCard.findOne({ where: { userId: userId } });
    const charge = await createCharge(customer.customerId, creditCardId, amount);
    if (charge.status === 'successful') {
      const order = await Order.create({
        omiseCreatedAt: charge.created_at,
        cardId: charge.card.id,
        sourceId: null,
        chargeId: charge.id,
        amount: charge.amount / 100,
        status: 'successful',
        paidAt: charge.paid_at,
        expiresAt: charge.expired_at,
        shippingStatus: 'To Ship',
        shippingTrackingId: '',
        addressId: address.id,
      });

      // Update Stock
      orders.forEach(async (product) => {
        const { productId, quality } = product;
        const productUpdate = await Product.findOne({ where: { id: productId } });
        productUpdate.countStock = +productUpdate.countStock - +quality;
        productUpdate.save();
      });

      const orderItemCreate = orders.map((product) => {
        const { productId, quality } = product;
        return {
          productId: productId,
          quality: quality,
          orderId: order.id,
        };
      });

      await CartItem.destroy({ where: { cartId: cartId } });

      await OrderItem.bulkCreate(orderItemCreate);
      return res.status(200).json({ charge, order });
    } else {
      await deleteCreditCard(customer.customerId, creditCardId);
    }
    res.status(200).json({ charge });
  } catch (err) {
    next(err);
  }
};

exports.createOrderWithCardIdAndAddressId = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { addressId, creditCardId, amount, orders, cartId } = req.body;
    const customer = await CreditCard.findOne({ where: { userId: userId } });
    const charge = await createCharge(customer.customerId, creditCardId, amount);
    if (charge.status === 'successful') {
      const order = await Order.create({
        omiseCreatedAt: charge.created_at,
        cardId: charge.card.id,
        sourceId: null,
        chargeId: charge.id,
        amount: charge.amount / 100,
        status: 'successful',
        paidAt: charge.paid_at,
        expiresAt: charge.expired_at,
        shippingStatus: 'To Ship',
        shippingTrackingId: '',
        addressId: addressId,
      });

      // Update Stock
      orders.forEach(async (product) => {
        const { productId, quality } = product;
        const productUpdate = await Product.findOne({ where: { id: productId } });
        productUpdate.countStock = +productUpdate.countStock - +quality;
        productUpdate.save();
      });

      const orderItemCreate = orders.map((product) => {
        const { productId, quality } = product;
        return {
          productId: productId,
          quality: quality,
          orderId: order.id,
        };
      });

      await CartItem.destroy({ where: { cartId: cartId } });

      await OrderItem.bulkCreate(orderItemCreate);
      return res.status(200).json({ charge, order });
    } else {
      await deleteCreditCard(customer.customerId, creditCardId);
    }
    res.status(200).json({ charge });
  } catch (err) {
    next(err);
  }
};

exports.getAllOrder = async (req, res, next) => {
  try {
    const { offset } = req.query;
    const count = await Order.findAll({
      group: 'shippingStatus',
      attributes: [[Sequelize.fn('COUNT', Sequelize.col('*')), 'count'], 'shippingStatus'],
    });

    const getAllOrder = await Order.findAll({
      order: [['omiseCreatedAt', 'DESC']],
      include: { paranoid: false, model: Address, include: { model: User } },
      where: {
        '$Address.User.id$': req.user.role === 'CUSTOMER' ? req.user.id : { [Op.or]: [] },
      },
      limit: 7,
      offset: +offset,
    });

    const orderItems = getAllOrder.map((orderList) => {
      const { id, omiseCreatedAt, amount, shippingStatus, Address, shippingTrackingId } = orderList;
      return {
        orderId: id,
        firstname: Address.User.firstName,
        date: omiseCreatedAt,
        amount: amount,
        shippingStatus: shippingStatus,
        shippingTrackingId: shippingTrackingId,
      };
    });
    res.status(200).json({ orderItems, count });
  } catch (err) {
    next(err);
  }
};

exports.orderAdminEditShippingInfo = async (req, res, next) => {
  try {
    const { id, shippingStatus, shippingTrackingId } = req.body;
    const { orderId } = req.params;
    const updateShippingInfo = await Order.update({ shippingStatus, shippingTrackingId }, { where: { id: orderId } });
    res.status(201).json(updateShippingInfo);
    console.log(shippingTrackingId);
  } catch (err) {
    next(err);
  }
};

exports.getOrderItemById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const orderItemData = await OrderItem.findAll({
      where: {
        orderId: id,
      },
      attributes: ['id', 'quality', 'productId', 'orderId'],
      include: [
        {
          model: Product,
          attributes: ['price', 'name', 'color'],
          include: {
            model: ProductImage,
            attributes: ['imageUrl'],
          },
        },
        {
          model: Order,
          attributes: ['shippingTrackingId', 'cardId', 'shippingStatus'],
          include: {
            paranoid: false,
            model: Address,
            include: {
              model: User,
              attributes: ['email'],
            },
          },
        },
      ],
    });
    const orderItem = orderItemData.map((item) => {
      return {
        id: item.id,
        imageUrl: item.Product.ProductImages[0].imageUrl,
        quality: item.quality,
        name: item.Product.name,
        colorName: item.Product.color,
        price: item.Product.price,
        orderId: item.orderId,
        amount: item.Product.price * item.quality,
        tracking: item.Order.shippingTrackingId,
        cardId: item.Order.cardId,
        status: item.Order.shippingStatus,
      };
    });
    res.json({ orderItem, address: orderItemData[0].Order.Address });
  } catch (err) {
    next(err);
  }
};
