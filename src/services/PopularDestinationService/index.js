/**
 * @file Using the separation of concern principle, this file handles the business logic accesses
 * the data repository which in turn queries the data, it handles creating, accessing and modifying destination data
 * @author Gabriel <Gabrielsonchia@gmail.com> <20/06/2020 06:37am>
 * @since 0.1.0
 * Last Modified: Gabriel <Gabrielsonchia@gmail.com> <13/07/2020 06:17pm>
 */

const _ = require('lodash');
const   PopularDestinationRepo = require('../../data/repository/PopularDestinationRepo');
const signToken = require('../../utilities/jwt');
const {
  BadRequestError,
} = require('../../utilities/core/ApiError');

/**
 * @class DestinationService
 * @classdesc a class responsible for the Destination business logic
 */
class DestinationService {
  /**
   * @description A static method to create popular destinations
   * @param data An object that contains request object
   * @return {Promise<UserModel>}
   */
static async createPopularDestination(data) {
    const details = data.body;
    const user_id = req.user.id
    // create the new  popular destination in the database
    let newDestination = await PopularDestinationRepo.create(details);
     //generating jwt for user
     const token = signToken(user_id);
    // pick only required fields
    newDestination = _.pick(newDestination, [
      '_id',
      'name',
      'ratingsAverage',
      'ratingsQuantity',
      'country',
      'summary',
      'description',
      'imageCover',
      'images'
    ]);
    // return the user object
    return {token,  newDestination};
  }

  /**
   * @description A static method to get all popular destinations
   * @param userId Id of the logged in user
   * @return {Promise<UserModel>}
   */
  static async getAllPopularDestinations(userId) {
    let selectedProperties = [];
    // Retrieving all popular destination
    let popularDestinations = await PopularDestinationRepo.getAllPopularDestinations()
    //generating jwt for user
    const token = signToken(userId);
    // pick only required fields
    popularDestinations.forEach(destination => {
      destination = _.pick(destination, [
        '_id',
        'name',
        'ratingsAverage',
        'ratingsQuantity',
        'country',
        'summary',
        'imageCover',
      ]);
      selectedProperties.push(destination);
    })
     
    // return the selected fields
    return {token,selectedProperties};
  }

  /**
   * @description A static method to get popular destination by ID
   * @param data The destination's ID 
   * @param id Logged in user Id
   * @return {Promise<UserModel>}
   */
  static async getAllPopularDestinationById(data,id) {
    // Retrieving all popular destination
    let destination = await PopularDestinationRepo.getPopularDestination(data,{ path: 'reviews' });
     // if we don't found destination with that ID, throw BadRequestError
     if (!destination) throw new BadRequestError("Destination with ID doesn't exist");
     //generating jwt for user
     const token = signToken(id);
    // pick only required fields
      destination = _.pick(destination, [
        '_id',
        'name',
        'ratingsAverage',
        'ratingsQuantity',
        'country',
        'summary',
        'description',
        'imageCover',
        'images',
        'reviews'
      ]);
     

    // return the selected fields
    return {token,destination};
  }
}

// exports class as a module
module.exports = DestinationService;
