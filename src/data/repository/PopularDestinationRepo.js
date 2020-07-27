/**
 * @file Manages all database queries related to the Popular Destinations document(table)
 * @author Gabriel <gabrielsonchia@gmail.com@gmail.com> <20/06/2020 06:37am>
 * @since 0.1.0
 * Last Modified: Gabriel <gabrielsonchia@gmail.com@gmail.com> <13/07/2020 06:17pm>
 */

const PopularDestinations = require('../models/PopularDestinations');

/**
 * @class PopularDestinationsRepo
 * @classdesc  a class with static database query methods, this class contains all queries for the popular destinations model.
 */
class PopularDestinationsRepo {
  /**
   * @description A static method to create a new popular destination.
   * @param PopularDestinationData - The Popular Destination's data
   * @returns {Promise<UserModel>}
   */
  static async create(PopularDestinationData) {
    const PopularDestination = await PopularDestinations.create(PopularDestinationData);
    return PopularDestination.toObject();
  }

  /**
   * @description A static method to retrieve all popular destinations.
   * @returns {Object}
   */
  static async getPopularDestination(id, popOptions) {
    let query = PopularDestinations.findById(id);
    if(popOptions) query = query.populate(popOptions);
    return await query;
  } 

  /**
   * @description A static method to retrieve a particular popular destination by ID.
   * @returns {Object}
   */
  static getAllPopularDestinations() {
    return PopularDestinations.find();
  } 
}

// exports class as a module
module.exports = PopularDestinationsRepo;
