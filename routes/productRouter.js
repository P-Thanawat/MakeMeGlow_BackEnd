const express = require('express');
const productController = require('../controller/productController');
const passport = require('passport');
const { upload } = require('../middleware/multer');

const productRouter = express.Router();

productRouter.post('/byProductName', productController.getProductByName);
productRouter.get('/arrival', productController.getProductNewArrival);
productRouter.post(
  '/checkFavorite',
  passport.authenticate('jwtAll', { session: false }),
  productController.checkFavorite
);
productRouter.post('/favorite', passport.authenticate('jwtAll', { session: false }), productController.createFavorite);
productRouter.post('/cart', passport.authenticate('jwtAll', { session: false }), productController.createCartItem);
productRouter.delete(
  '/favorite/:productId',
  passport.authenticate('jwtAll', { session: false }),
  productController.deleteFavorite
);

//*product-Summary
productRouter.get('/', passport.authenticate('jwtAdmin', { session: false }), productController.getProductAll);
productRouter.delete(
  '/:productId',
  passport.authenticate('jwtAdmin', { session: false }),
  productController.deleteProduct
);
productRouter.post(
  '/',
  passport.authenticate('jwtAdmin', { session: false }),
  upload.array('imageUrl', 7),
  productController.createNewProduct
);
productRouter.get(
  '/productImage/:productId',
  passport.authenticate('jwtAdmin', { session: false }),
  productController.getProductImageByProductId
);
productRouter.put(
  '/:productId',
  passport.authenticate('jwtAdmin', { session: false }),
  upload.array('imageUrl', 7),
  productController.updateProduct
);
productRouter.get(
  '/readyToShip/:productId',
  passport.authenticate('jwtAdmin', { session: false }),
  productController.readyToShip
);

//BomB

// AllProduct
productRouter.get('/all_product/products', productController.getAllProductByCategory);

//get All Fav
productRouter.get(
  '/favorite/All',
  passport.authenticate('jwtCustomer', { session: false }),
  productController.getAllFavoriteProduct
);

productRouter.get('/feature_product/All', productController.getFeatureProduct);
productRouter.get('/best_seller/All', productController.getBestSellerProduct);

module.exports = productRouter;
