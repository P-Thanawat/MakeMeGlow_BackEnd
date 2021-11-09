const router = require('express').Router();
const passport = require('passport');
const creditCardController = require('../controller/creditCard');

router.get('/', passport.authenticate('jwtCustomer', { session: false }), creditCardController.getAllCreditCard);
router.post('/', passport.authenticate('jwtCustomer', { session: false }), creditCardController.AddCreditCard);
router.post(
  '/:cardId',
  passport.authenticate('jwtCustomer', { session: false }),
  creditCardController.DeleteCreditCard
);

module.exports = router;
