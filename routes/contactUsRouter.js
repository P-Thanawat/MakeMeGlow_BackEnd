const express = require('express');
const contactUsController = require('../controller/contactUsController');

const contactUsRouter = express.Router();

contactUsRouter.get('/', contactUsController.getAllContactUs)
contactUsRouter.post('/', contactUsController.createContactUs)
contactUsRouter.delete('/:id', contactUsController.deleteContactUsById)

module.exports = contactUsRouter;
