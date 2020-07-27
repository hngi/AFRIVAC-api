/**
 * @file Defines the basic configuration of the Express Framework @see {@link https://expressjs.com/} and Mongoose
 * ORM @see {@link https://mongoosejs.com} connection to MONGODB database. Then it exports the config as module.
 * @author Gabriel <gabrielsonchia@gmail.com> <20/06/2020 06:37am>
 * @since 0.1.0
 * Last Modified: Gabriel <gabrielsonchia@gmail.com> <13/07/2020 06:17pm>
 */

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const routeHandler = require('./src/routes');
const {
  ApiError,
  InternalError,
  NotFoundError,
} = require('./src/utilities/core/ApiError');

module.exports = (config) => {
  const app = express();
console.log(config.mongodb);
  // initialize mongodb connection with mongoose
  mongoose
    .connect(config.mongodb.dsn, config.mongodb.options)
    .then(() => {
      config.logger.info('Successfully connected to MongoDb');
    })
    .catch((error) =>
      config.logger.info(`Could not connect to MongoDb\n${error}`)
    );
  mongoose.set('useFindAndModify', false); // fix findOneAndUpdate() deprecation warning

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  /**
   * Adds application routes middleware from the routes index which groups all routes together
   */
  app.use('/api/v1', routeHandler(config));

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    next(new NotFoundError('Resource Not Found'));
  });

  // error handler
  // eslint-disable-next-line no-unused-vars
  app.use(function (err, req, res, next) {
    // Checks if err is thrown by us and handled to the ApiError Class, if not we throw and handle an internal server error
    if (err instanceof ApiError) {
      // TODO: log error to a file
      ApiError.handle(err, res);
    } else {
      // TODO: log error to a file
      ApiError.handle(new InternalError(), res);
    }
    // log error to the console for debugging purpose
    config.logger.error(`${err} app----`);
  });

  return app;
};
