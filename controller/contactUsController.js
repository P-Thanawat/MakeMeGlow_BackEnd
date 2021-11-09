const { ContactUs } = require('../models');

exports.createContactUs = async (req, res, next) => {
  try {
    const { firstName, lastName, email, message } = req.body
    const contactUs = await ContactUs.create({
      firstName,
      lastName,
      email,
      message
    })
    res.status(201).json({ contactUs })
  }
  catch (err) {
    next(err);
  }
}

exports.getAllContactUs = async (req, res, next) => {
  try {
    const { offset } = req.query;
    const limitPerPage = 7;
    console.log(`offset`, offset)
    const contactUs = await ContactUs.findAll({
      order: [['updatedAt', 'DESC']],
      offset: +offset,
      limit: limitPerPage,
    })

    const allContactUs = await ContactUs.findAll()
    const numberOfPage = Math.ceil(allContactUs.length / limitPerPage)
    res.status(201).json({ contactUs, numberOfPage })
  }
  catch (err) {
    next(err);
  }
}

exports.deleteContactUsById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const rows = await ContactUs.destroy({
      where: {
        id
      },
    });
    if (rows === 0) return res.status(400).json({ message: 'Delete is failed' });
    res.status(204).json();
  } catch (err) {
    next(err);
  }
};