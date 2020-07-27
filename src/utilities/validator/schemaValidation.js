/**
 * @file This file performs the actual validation, it serves as the middleware which intercepts every request
 * to our API endpoints and validate the request data before handling control over to the route handler
  * @author Gabriel <gabrielsonchia@gmail.com> <20/06/2020 06:37am>
 * @since 0.1.0
 * Last Modified: Gabriel <gabrielsonchia@gmail.com> <13/07/2020 06:17pm>
 */

const _ = require('lodash');
const SchemaExport = require('./schemas');
const { BadRequestError } = require('../core/ApiError');

module.exports = () => {
  // Joi validation options
  const validationOptions = {
    abortEarly: false, // abort after the last validation error
    allowUnknown: true, // allow unknown keys that will be ignored
    stripUnknown: true, // remove unknown keys from the validated data
  };

  // return the validation middleware
  return (req, res, next) => {
    // get the request route
    const route = req.originalUrl;
    // get the request method
    const method = req.method.toLowerCase();
    // defines the different data that could be validated
    const payload = {
      'req.query': req.query,
      'req.body': req.body,
      'req.params': req.params,
    };

    /**
     * checks if the request route has an object property on the SchemaExport, if yes gets the schemaObject otherwise
     * exit this middleware by returning next()
     */
    if (_.has(SchemaExport, route)) {
      // get schemaObject for the current route
      const SchemaObject = _.get(SchemaExport, route);

      // checks if there is a validation schema for the request method, if no exit this middleware by returning next()
      if (SchemaObject.method === method.toUpperCase()) {
        // Validate payload using the schema and validation options
        const { error, value } = SchemaObject.schema.validate(
          _.get(payload, SchemaObject.payload),
          validationOptions
        );

        if (error) {
          // Joi Error
          const JoiError = {
            // eslint-disable-next-line no-underscore-dangle
            original: error._original,

            // fetch only message and type from each error
            errors: _.map(error.details, ({ message, type }) => ({
              message: message.replace(/['"]/g, ''),
              type,
            })),
          };
          // throw error with is then handled by the error handler
          throw new BadRequestError(
            'Invalid request data. Please review request and try again.',
            JoiError
          );
        } else {
          // Replace payload with the data after Joi validation
          if (SchemaObject.payload === 'req.query') {
            req.query = value;
          } else if (SchemaObject.payload === 'req.body') {
            req.body = value;
          } else {
            req.params = value;
          }
          return next();
        }
      }
      return next();
    }
    return next();
  };
};
