/**
 * @file Handles all popular destination related operations
 * @author Gabriel <Gabrielsonchia@gmail.com> <20/06/2020 06:37am>
 * @since 0.1.0
 * Last Modified: Gabriel <Gabrielsonchia@gmail.com> <13/07/2020 06:17pm>
 */
const express = require('express');

const router = express.Router();
const PopularDestinationService = require('../../services/PopularDestinationService/index');

const {
    SuccessResponse,
    CreatedResponse,
} = require('../../utilities/core/ApiResponse');

const asyncHandler = require('../../utilities/asyncHandler');

// eslint-disable-next-line no-unused-vars
module.exports = (config) => {
    /**
     * This route handles the GET verb for retrieving user details
     */
    router.get(
        '/',
        asyncHandler(async (req, res) => {
            const popularDestination = await PopularDestinationService.getAllPopularDestinations()
            return new SuccessResponse('Popular Destination data retrieved successful', popularDestination).send(res);
        })
    );

    router.get(
        '/:id',
        asyncHandler(async (req, res) => {
            const popularDestination = await PopularDestinationService.getAllPopularDestinationsById(req.params.id)
            return new SuccessResponse('Popular Destination data retrieved successful', popularDestination).send(res);
        })
    );

    return router;
};