const router = require('express').Router();
const passport = require('passport');
const addressController = require('../controller/address');

router.get('/', passport.authenticate('jwtCustomer', { session: false }), addressController.getAllAddress);
router.post('/', passport.authenticate('jwtCustomer', { session: false }), addressController.createAddress);
router.delete('/:id', passport.authenticate('jwtCustomer', { session: false }), addressController.deleteAddressById);
router.put('/:id', passport.authenticate('jwtCustomer', { session: false }), addressController.updateAddressById);

module.exports = router;
