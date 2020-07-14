/**
 * @file Handles all Auth routes, local and third party Authentication
 * @author Gabriel <bennkeys1@gmail.com> <20/06/2020 06:37am>
 * @since 0.1.0
 * Last Modified: Gabriel <Gabriel@gmail.com> <13/07/2020 06:17pm>
 */

const express = require('express');

const router = express.Router();
const LocalService = require('../../services/authService/LocalService');
const GoogleService = require('../../services/authService/GoogleService');

const {
    SuccessResponse,
    CreatedResponse,
} = require('../../utilities/core/ApiResponse');

const {
    AuthFailureError
} = require('../../utilities/core/ApiError');

const asyncHandler = require('../../utilities/asyncHandler');

// eslint-disable-next-line no-unused-vars
module.exports = (config) => {
    /**
     * This route handles the POST verb for user login
     */
    router.post(
        '/login',
        asyncHandler(async (req, res) => {
            const data = req.body;
            const user = await LocalService.login(data);
            return new SuccessResponse('Login was Successful', user).send(res);
        })
    );

    /**
     * This route handles the POST verb for user signup
     */
    router.post(
        '/signup',
        asyncHandler(async (req, res) => {
            const data = req.body;
            const user = await LocalService.signup(data);
            return new CreatedResponse('Registration was Successful', user).send(res);
        })
    );

    router.get(
        '/google',
        asyncHandler(async (req, res) => {
            res.redirect(GoogleService.url());
        })
    );

    router.get(
        '/google/callback',
        asyncHandler(async (req, res) => {
            const {
                user,
                data
            } = await GoogleService.processUser(req.query.code);
            // returns existing user
            if (user)
                return new SuccessResponse('Login was Successful', user).send(res);
            // returns new user data for the user to create account
            return new CreatedResponse('User data was returned', data).send(res);
        })
    );

    return router;
};