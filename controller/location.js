const { Province, District, Amphur } = require('../models');

exports.getAllProvince = async (req, res, next) => {
  try {
    const provinces = await Province.findAll({ order: ['name'] });
    res.status(200).json({ provinces });
  } catch (err) {
    next(err);
  }
};

exports.getDistrictByProvinceId = async (req, res, next) => {
  try {
    const { provinceId } = req.params;
    const districts = await Amphur.findAll({ where: { provinceId }, order: ['name'] });
    res.status(200).json({ districts });
  } catch (err) {
    next(err);
  }
};

exports.getSubDistrictByDistrictId = async (req, res, next) => {
  try {
    const { amphurId } = req.params;
    console.log(amphurId);
    const sub_districts = await District.findAll({ where: { amphurId }, order: ['name'] });
    res.status(200).json({ sub_districts });
  } catch (err) {
    next(err);
  }
};

exports.getPostalCode = async (req, res, next) => {
  try {
    const { amphurId } = req.params;
    const postal_code = await Amphur.findOne({ where: { id: amphurId } });
    res.status(200).json({ postal_code: postal_code.postalCode });
  } catch (err) {
    next(err);
  }
};
