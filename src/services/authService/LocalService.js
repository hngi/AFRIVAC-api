/**
 * @file Using the separation of concern principle, this file handles the business logic accesses
 * the data repository which in turn queries the data, it handles the local login and signup
 * @author Gabriel <bennkeys1@gmail.com> <20/06/2020 06:37am>
 * @since 0.1.0
 * Last Modified: Gabriel <Gabriel@gmail.com> <13/07/2020 06:17pm>
 */

const _ = require('lodash');
const UserRepo = require('../../data/repository/UserRepo');
const   ReviewRepo = require('../../data/repository/ReviewRepo');
const signToken = require('./../../utilities/jwt');
const {
  AuthFailureError,
  BadRequestError,
} = require('../../utilities/core/ApiError');

/**
 * @class LocalService
 * @classdesc a class responsible for the User business logic
 */
class LocalService {
  /**
   * @description A static method to login already registered users using email and password
   * @param data An object that contains the email and password
   * @return {Promise<*>}
   */
  static async login(data) {
    // queries the database for the user using email and gets the user object
    let user = await UserRepo.findUserByEmail(data.email);

    // if no user, it means the email is not registered, therefore throw BadRequestError
    if (!user) throw new BadRequestError('User not registered');

    if(!user.password) throw new BadRequestError('Wrong authentication method used. Try other available methods')
    // we found a user with the email, now check if the password is correct
    const correctPassword = await user.comparePassword(data.password, user.password)
    //generating jwt for user
    const token = signToken(user._id);
    // if the password is incorrect, throw UnAuthorizedError
    if (!correctPassword) throw new AuthFailureError('Invalid Credentials');

    // extract only required fields
    user = _.pick(user, ['_id', 'name', 'email', 'photo', 'createdAt']);
    // return the found user object
    return{token, user}
  }

  /**
   * @description A static method to register users
   * @param data An object that contains users first and last name, email and password.
   * @return {Promise<UserModel>}
   */
  static async signup(data) {
    // checks if user with specified email already exist
    const user = await UserRepo.findUserByEmail(data.email);
    // if we found user with that email, throw BadRequestError since the emails must be unique
    if (user) throw new BadRequestError('User with email already exist');
    // create the new user in the database
    let newUser = await UserRepo.create(data);
     //generating jwt for user
     const token = signToken(newUser._id);
    // pick only required fields
    newUser = _.pick(newUser, [
      '_id',
      'name',
      'email',
      'createdAt',
      'photo'
    ]);
  
    // return the user object
    return {token, newUser};
  }

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
   * @param data An object that contains users ID.
   * @return {Promise<UserModel>}
   */
  static async getUsers() {
    // checks if user with specified ID exist
    let user = await UserRepo.getAllUsers();
    // if we don't found user with that ID, throw BadRequestError
    if (!user) throw new BadRequestError("No registered user");
  
    // pick only required fields
     user = _.pick(user, [
      '_id',
      'name',
      'email',
      'createdAt',
      'photo',
      'number'
    ]);
  
    // return the user object
    return user;
  }

  /**
   * @description A static method to update user details
   * @param data An object that contains users ID.
   * @return {Promise<UserModel>}
   */
  static async updateUser(id, data) {
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

  /**
   * @description A static method to create reviews
   * @param data An object that contains review and rating
   * @return {Promise<UserModel>}
   */
static async craeteReview(data) {
    // checks if user with specified email already exist
    const review = await ReviewRepo.craeteReview(data);
    // if we found user with that email, throw BadRequestError since the emails must be unique
    if (user) throw new BadRequestError('User with email already exist');
    // create the new user in the database
    let newUser = await UserRepo.create(data);
     //generating jwt for user
     const token = signToken(newUser._id);
    // pick only required fields
    newUser = _.pick(newUser, [
      '_id',
      'name',
      'email',
      'createdAt',
    ]);
    // return the user object
    return {token, newUser};
  }
}

// exports class as a module
module.exports = LocalService;
