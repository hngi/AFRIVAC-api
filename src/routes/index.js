/**
 * @file Organises all application route and exports the Express Router as module
 * @see {@link https://expressjs.com/en/guide/routing.html#expressRouter}
  * @author Gabriel <bennkeys1@gmail.com> <20/06/2020 06:37am>
 * @since 0.1.0
 * Last Modified: Gabriel <Gabriel@gmail.com> <13/07/2020 06:17pm>
 */

const express = require('express');
const authRoute = require('./auth');
const userRoute = require('./user');
const adminRoute = require('./admin');
const popularDestinationRouter = require('./popularDestination');
const reviewRouter = require('./review');
const Validator = require('../utilities/validator/schemaValidation');
const protect = require('../utilities/protect');

const router = express.Router();

module.exports = (config) => {
  /**
   *  ATTENTION:
   *  please place unprotected routes first as there is a fall-through when the jwt protection is
   *  placed on any route
   */
  
  router.use(Validator());
  router.use('/admin', adminRoute(config));
  router.use('/auth', authRoute(config));
  router.use(protect());
  router.use('/user', userRoute(config));
  router.use('/destinations', popularDestinationRouter(config));
  router.use('/reviews', reviewRouter(config));
  return router;
};
