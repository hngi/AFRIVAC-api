/**
 * @file This file exports all validation schemas with their intended routes
  * @author Gabriel <gabrielsonchia@gmail.com> <20/06/2020 06:37am>
 * @since 0.1.0
 * Last Modified: Gabriel <gabrielsonchia@gmail.com> <13/07/2020 06:17pm>
 */

const Authentication = require('./Authentication');

/**
 * @enum an object that's holds HTTP verbs. The object.freeze method is called to prevent addition of properties
 * later in the code. This emulates the ENUM type of other languages like JAVA
 */
const METHOD_ENUM = Object.freeze({
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
});

const PAYLOAD_ENUM = Object.freeze({
  QUERY: 'req.query',
  BODY: 'req.body',
  PARAMS: 'req.params',
});

// exports validation schemas with their designated route and method
module.exports = {
  '/auth/login': {
    method: METHOD_ENUM.POST,
    payload: PAYLOAD_ENUM.BODY,
    schema: Authentication.loginSchema(),
  },
  '/auth/signup': {
    method: METHOD_ENUM.POST,
    payload: PAYLOAD_ENUM.BODY,
    schema: Authentication.signupSchema(),
  },
  '/auth/google/callback': {
    method: METHOD_ENUM.GET,
    payload: PAYLOAD_ENUM.QUERY,
    schema: Authentication.oAuthSchema(),
  },
};
