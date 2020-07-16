/**
 * @file Manages all database queries related to the User document(table)
 * @author Gabriel <gabrielsonchia@gmail.com> <20/06/2020 06:37am>
 * @since 0.1.0
 * Last Modified: Gabriel <Gabrielsonchia@gmail.com> <13/07/2020 06:17pm>
 */

const crypto = require('crypto');
const mongoose = require("mongoose");
const validator = require('validator');
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const {
  Roles
} = require("./../../config/constants")
const asyncHandler = require('./../../utilities/asyncHandler');

const SALT_WORK_FACTOR = 10;

// define the user schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, 'name is required']
  },
  email: {
    type: String,
    required: [true, 'A user requires an email'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  password: {
    type: String,
    default: '',
    trim: true
  },
  role: {
    type: String,
    trim: true,
    enum: [Roles.USER, Roles.ADMIN],
    default: Roles.USER,
    select: false
  },
  country: {
    type: String,
  },
  google: {
    type: String,
    default: ''
  },
  googleTokens: Object,
  number: {
    type: Number,
    default: ''
  },
  photo: {
    type: String,
    default: "https://afrivac.s3.us-east-2.amazonaws.com/default.jpg"
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false
  },
  refreshToken: {
    type: String,
    trim: true,
    unique: true, // creates a MongoDB index, ensuring unique values
    sparse: true, // this makes sure the unique index applies to not null values only (= unique if not null)
    default: null,
  }
}, {
  timestamps: true,
});

/**
 * Before saving a users password, generate the salt and produce the hash value
 */
UserSchema.pre("save", function (next) {
  // assign the current object to plan variable
  const user = this;

  /**
   *  A useful condition for the OAuth Services, prevents the empty string password
   *  from being hashed. Password field would be empty since we are using oAuth
   */
  if (user.password === '') return next();

  // Only run this function if password was actually modified
  if (!user.isModified('password')) return next();

  // only hash the password if it has been modified (or is new)
  if (user.isModified('password') || user.isNew) {
    // generate a salt
    return bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
      if (err) return next(err);
      // hash the password using our new salt
      return bcrypt.hash(user.password, salt, (hasherr, hash) => {
        if (hasherr) return next(hasherr);
        // override the cleartext password with the hashed one
        user.password = hash;
        return next();
      });
    });
  }
  return next();
  next();
});

UserSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

/**
 * Decrypts the encrypted password and compares it to the provided password during login
 * @param candidatePassword String - plain password
 */
UserSchema.methods.comparePassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

/**
 * This method will generate a random string with a length of 30 characters. Then create a SHA512 hash of this
 * random string, store the hashed value as the plan’s refresh token and then return the non-hashed value.
 * @returns {Promise<string>}
 */
UserSchema.methods.createRefreshToken = asyncHandler(async function () {
  const refreshToken = crypto.randomBytes(30).toString('hex');

  this.refreshToken = crypto
    .createHash('sha512')
    .update(refreshToken)
    .digest('hex');

  await this.save(); // TODO: Throw the right error here - Benn Ajax

  return refreshToken;
});


/**
 * Create a static method on the plan schema to find a plan by a given refresh token. Notice that this method
 * is a static method (schema.statics) because you want to query for a specific document from the plan model.
 * The refresh token in the database is a hashed value. The plan receives the plain token value. That’s why
 * you need to hash the incoming refresh token before querying the database for it.
 * @param refreshToken
 * @returns {*}
 */
UserSchema.statics.findByRefreshToken = function (refreshToken) {
  return this.findOne({
    refreshToken: crypto
      .createHash('sha512')
      .update(refreshToken)
      .digest('hex'),
  });
};

const User = mongoose.model('User', UserSchema);

module.exports = User;