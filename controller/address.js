const { Address } = require('../models');

exports.getAllAddress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const allAddress = await Address.findAll({ where: { userId: userId } });
    res.status(200).json({ allAddress, count: allAddress.length });
  } catch (err) {
    next(err);
  }
};

exports.createAddress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, address1, address2, province, district, subDistrict, postalCode, phoneNumber } =
      req.body;
    const address = await Address.create({
      firstName,
      lastName,
      address1,
      address2,
      subDistrict,
      district,
      province,
      postalCode,
      phoneNumber,
      userId,
    });
    res.status(200).json({ address });
  } catch (err) {
    next(err);
  }
};

exports.deleteAddressById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const rows = await Address.destroy({
      where: {
        id,
      },
    });
    if (rows === 0) return res.status(400).json({ message: 'Delete is failed' });
    res.status(204).json();
  } catch (err) {
    next(err);
  }
};

exports.updateAddressById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, address1, address2, province, district, subDistrict, postalCode, phoneNumber } =
      req.body;
    const [rows] = await Address.update(
      {
        firstName,
        lastName,
        address1,
        address2,
        subDistrict,
        district,
        province,
        postalCode,
        phoneNumber,
        userId: req.user.id,
      },
      {
        where: {
          id,
        },
      }
    );
    if (rows === 0) {
      return res.status(400).json({ message: 'Update is failed' });
    }
    res.json({ message: 'Updated is Successful' });
  } catch (err) {
    next(err);
  }
};
