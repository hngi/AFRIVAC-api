/**
 * @file This file defines the validation schema for login and signup routes
 * the data repository which in turn queries the data
 * @author Gabriel <gabrielsonchia@gmail.com> <20/06/2020 06:37am>
 * @since 0.1.0
 * Last Modified: Gabriel <gabrielsonchia@gmail.com> <13/07/2020 06:17pm>
 */

const Joi = require('@hapi/joi');

/**
 * @class Authentication
 * @classdesc An authentication schema class responsible for login and signup route
 */
class Authentication {
  /**
   * @description defines the req.body schema for "auth/login" route
   * @return {Joi}
   */
  static loginSchema() {
    return Joi.object({
      email: Joi.string().email().lowercase().required(),
      password: Joi.string().min(8).required().strict(),
    });
  }

  /**
   * @description defines the req.body schema for "auth/signup" route
   * @return {Joi}
   */
  static signupSchema() {
    return Joi.object({
      firstName: Joi.string()
        .regex(/^[A-Za-z]+$/)
        .lowercase()
        .trim()
        .required(),
      lastName: Joi.string()
        .regex(/^[A-Za-z]+$/)
        .lowercase()
        .trim()
        .required(),
      email: Joi.string().email().lowercase().required(),
      password: Joi.string()
        .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
        .min(8)
        .required()
        .strict(),
      confirmPassword: Joi.string()
        .valid(Joi.ref('password'))
        .required()
        .strict(),
    });
  }

  /**
   * @description defines the req.query schema for OAuth
   * @return {*}
   */
  static oAuthSchema() {
    return Joi.object({
      code: Joi.string().required(),
    });
  }
}

// exports class as module
module.exports = Authentication;
