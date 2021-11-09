const omise = require('omise')({ secretKey: 'skey_test_5ov8h8rdpslf54x97k1' });

exports.retrieveCustomerPromise = (customer_id) => {
  return new Promise((resolve, reject) => {
    omise.customers.retrieve(customer_id, function (err, customer) {
      if (err) {
        reject(err);
      } else {
        resolve(customer);
      }
    });
  });
};

exports.addCreditCard = (customer_id, token) =>
  new Promise((resolve, reject) => {
    omise.customers.update(customer_id, { card: token }, function (error, customer) {
      if (error) {
        reject(error);
      } else {
        resolve(customer);
      }
    });
  });

exports.deleteCreditCard = (customer_id, card_id) =>
  new Promise((resolve, reject) => {
    omise.customers.destroyCard(customer_id, card_id, function (error, card) {
      if (error) {
        reject(error);
      } else {
        resolve(card);
      }
    });
  });

exports.createCharge = (customer_id, card_id, amount) =>
  new Promise((resolve, reject) => {
    omise.charges.create(
      {
        amount: amount * 100,
        currency: 'THB',
        customer: customer_id,
        card: card_id,
      },
      function (error, charge) {
        if (error) {
          reject(error);
        } else {
          resolve(charge);
        }
      }
    );
  });
