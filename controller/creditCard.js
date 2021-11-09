const { CreditCard } = require('../models');
const { retrieveCustomerPromise, addCreditCard, deleteCreditCard } = require('../util/omise');

exports.getAllCreditCard = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const creditCard = await CreditCard.findOne({ where: { userId } });
    const customer = await retrieveCustomerPromise(creditCard.customerId);

    res.status(200).json({ creditCards: customer.cards.data, count: customer.cards.data.length });
  } catch (err) {
    next(err);
  }
};

exports.AddCreditCard = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { token } = req.body;
    const creditCard = await CreditCard.findOne({ where: { userId } });
    const customer = await addCreditCard(creditCard.customerId, token);
    res.status(201).json({ message: 'Add card Success!!' });
  } catch (err) {
    next(err);
  }
};

exports.DeleteCreditCard = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { cardId } = req.params;
    const creditCard = await CreditCard.findOne({ where: { userId } });
    await deleteCreditCard(creditCard.customerId, cardId);
    res.status(204).json();
  } catch (err) {
    next(err);
  }
};
