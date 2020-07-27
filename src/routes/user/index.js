/**
 * @file Handles all user related operations exceptiong authentication
 * @author Gabriel <bennkeys1@gmail.com> <20/06/2020 06:37am>
 * @since 0.1.0
 * Last Modified: Gabriel <Gabriel@gmail.com> <13/07/2020 06:17pm>
 */

const express = require('express');

const router = express.Router();
const LocalService = require('../../services/userService/index');

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
     * This route handles the GET verb for retrieving user details
     */
    router.get(
        '/',
        asyncHandler(async (req, res) => {
            const id = req.user._id;
            const user = await LocalService.getUser(id);
            return new SuccessResponse('User data retrieved successful', user).send(res);
        })
    );

    /**
     * This route handles the PUT verb for user update
     */
    router.put(
        '/',
        asyncHandler(async (req, res) => {
            const data = req.body;
            const user = await LocalService.updateUser(req.user._id, data);
            return new CreatedResponse('Update was Successful', user).send(res);
        })
    );
    return router;
};