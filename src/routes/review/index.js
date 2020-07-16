/**
 * @file Handles all review routes
 * @author Gabriel <Gabrielsonchia@gmail.com@gmail.com> <20/06/2020 06:37am>
 * @since 0.1.0
 * Last Modified: Gabriel <Gabrielsonchia@gmail.com> <13/07/2020 06:17pm>
 */

const express = require('express');

const router = express.Router();
const ReviewService = require('../../services/reviewService');
const PopularDestinationService = require("./../../services/PopularDestinationService");

const {
    SuccessResponse,
    CreatedResponse,
} = require('../../utilities/core/ApiResponse');


const asyncHandler = require('../../utilities/asyncHandler');

// eslint-disable-next-line no-unused-vars
module.exports = (config) => {
    /**
     * This route handles the POST and GET verb for user login
     */
    router.route('/')
    .post(asyncHandler(async (req, res) => {
            const data = req.body;
            await ReviewService.createReview(data, req.user._id);
            const destination = await PopularDestinationService.getAllPopularDestinationById(data.destination)
            return new SuccessResponse('Review was Successful Created', destination).send(res);
        })
    )
    .get(asyncHandler(async (req, res) => {
        const data = req.body;
        const user = await LocalService.login(data);
        return new SuccessResponse('Login was Successful', user).send(res);
    }))

    return router;
};