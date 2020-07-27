/**
 * @file Manages all database queries related to the User document(table)
 * @author Gabriel <gabrielsonchia@gmail.com> <20/06/2020 06:37am>
 * @since 0.1.0
 * Last Modified: Gabriel <gabrielsonchia@gmail.com> <13/07/2020 06:17pm>
 */

const UserModel = require('../models/User');

/**
 * @class UserRepo
 * @classdesc  a class with static database query methods, this class contains all queries for the User model.
 */
class UserRepo {
  /**
   * @description A static method to create a new user.
   * @param userData - The user credentials
   * @returns {Promise<UserModel>}
   */
  static async create(userData) {
    const user = await UserModel.create(userData);
    return user.toObject();
  }

  /**
   * @description A static method to find users by email.
   * @returns {Promise<UserModel>}
   */
  static findUserByEmail(email) {
    return UserModel.findOne({ email }).exec();
  }

  /**
   * @description A static method to find users by Id.
   * @returns {Object}
   */
  static findUserById(userId) {
    return UserModel.findById({ _id: userId });
  }

  /**
   * @description A static method to find users by Google Id.
   * @returns {Object}
   */
  static findUserByGoogleId(profileId) {
    return UserModel.findOne({ google: profileId });
  }

  /**
   * @description A static method to update users by Id.
   * @returns {Object}
   */
  static updateOneById(profileId, data) {
    return UserModel.findOneAndUpdate({ _id: profileId }, data, { new: true });
  }

  /**
   * @description A static method to returns all users.
   * @returns {Object}
   */
  static getAllUsers() {
    return UserModel.find();
  }
}

// exports class as a module
module.exports = UserRepo;
