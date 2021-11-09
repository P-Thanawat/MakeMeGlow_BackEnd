const router = require('express').Router();
const passport = require('passport');
const locationController = require('../controller/location');

router.get('/province', passport.authenticate('jwtCustomer', { session: false }), locationController.getAllProvince);
router.get(
  '/district/:provinceId',
  passport.authenticate('jwtCustomer', { session: false }),
  locationController.getDistrictByProvinceId
);
router.get(
  '/sub_district/:amphurId',
  passport.authenticate('jwtCustomer', { session: false }),
  locationController.getSubDistrictByDistrictId
);
router.get(
  '/postal_code/:amphurId',
  passport.authenticate('jwtCustomer', { session: false }),
  locationController.getPostalCode
);

module.exports = router;
