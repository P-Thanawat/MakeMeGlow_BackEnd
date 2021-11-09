const express = require('express')
const transactionController = require('../controller/transactionController')
const passport = require('passport');

const transactionRouter = express.Router();

transactionRouter.get('/', transactionController.getOrderByTime)

module.exports = transactionRouter;