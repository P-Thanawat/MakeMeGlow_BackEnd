const express = require('express');
const passport = require('passport');
const router = express.Router();
const authController = require('../controller/auth');
const { upload } = require('../middleware/multer');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/forgot_password', authController.forgotPassword);
router.post('/reset_password', authController.resetPassword);
router.post('/login/google', authController.loginWithGoogle);
router.post('/login/facebook', authController.loginWithFacebook);
router.put(
  '/',
  passport.authenticate('jwtAll', { session: false }),
  upload.single('imageUrl'),
  authController.editUserInformation
);
router.get('/:id', passport.authenticate('jwtAll', { session: false }), authController.getUserById);

module.exports = router;
