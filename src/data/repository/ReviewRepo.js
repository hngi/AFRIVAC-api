/**
 * @file Manages all database queries related to the Review document(table)
 * @author Gabriel <gabrielsonchia@gmail.com> <20/06/2020 06:37am>
 * @since 0.1.0
 * Last Modified: Gabriel <gabrielsonchia@gmail.com> <13/07/2020 06:17pm>
 */

const ReviewModel = require('../models/Review');

/**
 * @class UserRepo
 * @classdesc  a class with static database query methods, this class contains all queries for the User model.
 */
class ReviewRepo {
  /**
   * @description A static method to create a new review.
   * @param reviewData - The review data
   * @returns {Promise<UserModel>}
   */
  static async create(reviewData) {
    const review = await ReviewModel.create(reviewData);
    return review.toObject();
  }

  /**
   * @description A static method to find review by Id.
   * @returns {Object}
   */
  static getAllReviews() {
    return ReviewModel.find();
  }
}

// exports class as a module
module.exports = ReviewRepo;
