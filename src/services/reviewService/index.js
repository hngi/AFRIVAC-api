/**
 * @file Using the separation of concern principle, this file handles the business logic that accesses
 * the data repository which in turn queries the data, it handles accessing and modifying review data
 * @author Gabriel <gabrielsonchia@gmail.com> <20/06/2020 06:37am>
 * @since 0.1.0
 * Last Modified: Gabriel <gabrielsonchia@gmail.com> <13/07/2020 06:17pm>
 */

const _ = require('lodash');
const ReviewRepo = require('../../data/repository/ReviewRepo');
const signToken = require('./../../utilities/jwt');

/**
 * @class ReviewService
 * @classdesc a class responsible for the Review business logic
 */
class ReviewService {
  /**
   * @description A static method to get all reviews
   * @return {Promise<UserModel>}
   */
  static async getReviews() {
    let selectedProperties = [];
    // Retrieving all reviews
    let reviews = await ReviewRepo.getAllReviews();

    // pick only required fields
    reviews.forEach(user => {
      user = _.pick(user, [
        '_id',
        'review',
        'rating',
        'createdAt',
      ]);
      selectedProperties.push(user);
    })
     
    // return the user object
    return selectedProperties;
  }

  /**
   * @description A static method to create reviews
   * @param data An object that contains review and rating
   * @return {Promise<UserModel>}
   */
static async createReview(data, userId) {
    data.user = userId;
   // create the new review in the database
    let newReview = await ReviewRepo.create(data);
   
    //generating JSON web token with user id
     const token = signToken(newReview._id);
    // pick only required fields
    newReview = _.pick(newReview, [
      '_id',
      'review',
      'rating',
      'createdAt',
    ]);
    // return the review object with jwt token object
    return {token, newReview};
  }
}

// exports class as a module
module.exports = ReviewService;
