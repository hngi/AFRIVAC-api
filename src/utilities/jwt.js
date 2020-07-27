/**
 * @file This file exports a fuction that is used to generate a token to be sent back with the response.
 * @author Gabriel <gabrielsonchia@gmail.com> <20/06/2020 06:37am>
 * @since 0.1.0
 * Last Modified: Gabriel <gabrielsonchia@gmail.com> <13/07/2020 06:17pm>
 */

const jwt = require('jsonwebtoken');

/**
 * @description A function to generate a JSON web tken for a user.
 * @param id - id of user who made the request
 * @returns {String}
 */
module.exports = id => {
    return jwt.sign({
        id
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};