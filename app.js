require('dotenv').config();
require('./config/passport');
const express = require('express');
const app = express();
const cors = require('cors');
const passport = require('passport');
const { errorMiddleWare } = require('./middleware/error');
const userRoute = require('./routes/user');
const productRouter = require('./routes/productRouter');
const transactionRouter = require('./routes/transactionRouter');
const creditCardRoute = require('./routes/creditCardRoute');
const addressRoute = require('./routes/addressRoute');
const cartRoute = require('./routes/cart');
const orderRoute = require('./routes/order');
const locationRoute = require('./routes/location');
const contactUsRouter = require('./routes/contactUsRouter');
// const omise = require('omise')({ secretKey: 'skey_test_5ov8h8rdpslf54x97k1' });
// const { sequelize } = require('./models');
// sequelize.sync({ force: true });
// sequelize.sync({ force: false });

app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(express.static('/public'));
app.use(passport.initialize());

app.use('/users', userRoute);
app.use('/product', productRouter);
app.use('/transaction', transactionRouter);
app.use('/carts', cartRoute);
app.use('/credit_cards', creditCardRoute);
app.use('/address', addressRoute);
app.use('/orders', orderRoute);
app.use('/locations', locationRoute);
app.use('/contactUs', contactUsRouter);

app.use((req, res, next) => {
  res.status(404).json({ message: 'resource not found!!' });
});

// omise.customers.destroyCard('cust_test_5plyzbicruac6hxxbnn', 'card_test_5pm3gdsu5x6i3mya94q', function (error, card) {
//   /* Response. */
// });

app.use(errorMiddleWare);

const port = process.env.PORT || 8001;

app.listen(port, () => console.log(`Server is running on port ${port}......`));
