/**
 * @file Using the separation of concern principle, this file handles the business logic that accesses
 * the data repository which in turn queries the data, it handles accessing and modifying user's data
 * @author Gabriel <gabrielsonchia@gmail.com> <20/06/2020 06:37am>
 * @since 0.1.0
 * Last Modified: Gabriel <gabrielsonchia@gmail.com> <13/07/2020 06:17pm>
 */

const _ = require('lodash');
const UserRepo = require('../../data/repository/UserRepo');
const signToken = require('./../../utilities/jwt');
const {
  BadRequestError,
} = require('../../utilities/core/ApiError');

/**
 * @class UserService
 * @classdesc a class responsible for the User business logic
 */
class UserService {
  /**
   * @description A static method to get user details
   * @param data An object that contains users ID.
   * @return {Promise<UserModel>}
   */
  static async getUser(data) {
    // checks if user with specified ID exist
    let user = await UserRepo.findUserById(data);
    // if we don't found user with that ID, throw BadRequestError
    if (!user) throw new BadRequestError("User with ID doesn't exist");
  
     //generating jwt for user
     const token = signToken(user._id);
    // pick only required fields
     user = _.pick(user, [
      '_id',
      'name',
      'email',
      'createdAt',
      'photo'
    ]);
  
    // return the user object
    return {token, user};
  }

  /**
   * @description A static method to get all user details
   * @return {Promise<UserModel>}
   */
  static async getUsers() {
    let selectedProperties = [];
    // Retrieving all registered users
    let users = await UserRepo.getAllUsers();

    // pick only required fields
    users.forEach(user => {
      user = _.pick(user, [
        '_id',
        'name',
        'email',
        'createdAt',
        'photo',
        'number'
      ]);
      selectedProperties.push(user);
    })
     
    // return the user object
    return selectedProperties;
  }

  /**
   * @description A static method to update user details
   * @param data An object that contains users ID.
   * @return {Promise<UserModel>}
   */
  static async updateUser(id, data) {
    //check if user tries updating user email
    if(data.email) throw new BadRequestError("Email modification not allowed");
    // checks if user with specified ID exist
    let user = await UserRepo.updateOneById(id ,data);
    // if we don't found user with that ID, throw BadRequestError
    if (!user) throw new BadRequestError("User with ID doesn't exist");
  
     //generating jwt for user
     const token = signToken(user._id);
    // pick only required fields
     user = _.pick(user, [
      '_id',
      'name',
      'email',
      'createdAt',
      'photo'
    ]);
  
    // return the user object
    return {token, user};
  }
}

// exports class as a module
module.exports = UserService;
