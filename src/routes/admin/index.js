/**
 * @file Handles all user related operations exceptiong authentication
 * @author Gabriel <bennkeys1@gmail.com> <20/06/2020 06:37am>
 * @since 0.1.0
 * Last Modified: Gabriel <Gabriel@gmail.com> <13/07/2020 06:17pm>
 */

const express = require('express');

const router = express.Router();
const LocalService = require('../../services/authService/LocalService');

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
     * This route handles the GET verb for retrieving all user details
     */
    router.get(
        '/users',
        asyncHandler(async (req, res) => {
            const user = await LocalService.getUsers()
            return new SuccessResponse('User data retrieved successful', user).send(res);
        })
    );

    return router;
};