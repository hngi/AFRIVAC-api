/**
 * @file Using the separation of concern principle, this file handles the business
 * logic of signing up and signing in a user with a google account
 * @author Gabriel <gabrielsonchia@gmail.com> <20/06/2020 06:37am>
 * @since 0.1.0
 * Last Modified: Gabriel <gabrielsonchia@gmail.com> <13/07/2020 06:17pm>
 */
const dotenv = require('dotenv');
// load env configuration as early as possible
dotenv.config();
const { google } = require('googleapis');
const _ = require('lodash');
const UserRepo = require('../../data/repository/UserRepo');
const { BadRequestError } = require('../../utilities/core/ApiError');
// setup oAuthClient with credentials from the google dashboard
const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CALLBACK_URL
);

/**
 * @class GoogleService
 * @classdesc handles the google oAuth flow, generate redirection url and processes user data
 */
class GoogleService {
  /**
   * @description generates a url that ask permission for profile and email
   * @return {string[]} - an array of scope
   */
  static get scope() {
    return [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ];
  }

  /**
   * @description generates a url that redirects to the consent screen
   * @return {*} - url string
   */
  static url() {
    return oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent', // access type and approval prompt will force a new refresh token to be made each time signs in
      scope: GoogleService.scope,
      include_granted_scopes: true,
    });
  }

  /**
   * @description Exchanges authorization code for tokens(access and refresh), uses the tokens to receive the user profile and email,
   * checks if user already exist, if yes updates the refresh token otherwise return the new user data for user to create the account
   * @param code - authorization code from google
   * @return {Promise<{data: null, user: *}|{data: {firstName: *, lastName: *, google, profileImage: *, email, googleTokens:
   *  {token: *, refreshToken: *}}, user: null}>}
   */
  static async processUser(code) {
    // exchange authorization code for access and refresh tokens
    const { tokens } = await oAuth2Client.getToken(code);
    // set tokens to oAuth2Client
    oAuth2Client.setCredentials(tokens);
    const oauth2 = await google.oauth2({
      auth: oAuth2Client,
      version: 'v2',
    });
    // get user profile
    const profile = await oauth2.userinfo.v2.me.get({});
    console.log(profile);
    // checks if the get request was successful
    if (profile.status !== 200) throw new BadRequestError();
    // checks if user already exist in database, if yes update the access and refresh tokens
    const user = await UserRepo.findUserByGoogleId(profile.data.id);
    if (user) {
      // eslint-disable-next-line no-underscore-dangle
      let updatedUser = await UserRepo.updateOneById(user._id, {
        googleTokens: {
          token: tokens.access_token,
          refreshToken: tokens.refresh_token,
        },
      });
      // extract only required fields
      updatedUser = _.pick(updatedUser, [
        '_id',
        'name',
        'email',
        'createdAt',
      ]);
      // returns an object setting user to updated user details and data to null meaning this is not a new user
      return { user: updatedUser, data: null };
    }
    // This is a new user data that's passed back to the create account page using OAuth
    const data = {
      name: profile.data.name.toLowerCase(),
      email: profile.data.email,
      google: profile.data.id,
      googleTokens: {
        token: tokens.access_token,
        refreshToken: tokens.refresh_token,
      },
      photo: profile.data.picture,
    };
     // create the new user in the database
    let newUser = await UserRepo.create(data);
     // pick only required fields
     newUser = _.pick(newUser, [
      '_id',
      'name',
      'email',
      'createdAt',
    ]);
    // returns an object setting user to null meaning this is a new user and data to new user data
    return { user: null, data: newUser };
  }

  /**
   * @description revokes userToken and access
   * @param callback
   */
  static revokeUserToken(callback) {
    oAuth2Client.revokeCredentials(() => {
      callback(true);
    });
  }
}

module.exports = GoogleService;
