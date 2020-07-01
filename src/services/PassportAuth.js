var passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('./../models/User');

passport.use(new FacebookStrategy({
    clientID: "159030901322260",
    clientSecret: "0d641e47f5d55af221ec80346f3f2d43",
    callbackURL: "http://127.0.0.1:3000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({name: profile.displayName}, {name: profile.displayName,userid: profile.id}, function(err, user) {
      if (err) { return done(err); }
      done(null, user);
    });
  }
));

module.exports = passport;




passport.use(new GoogleStrategy({
    clientID: "591307876438-4nmmm817vks785u467lo22kss40kqno2.apps.googleusercontent.com",
    clientSecret: "BagENe4LxG_PZ_qz2oFX7Aok",
    callbackURL: "http://127.0.0.1:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
       User.findOrCreate({ userid: profile.id }, { name: profile.displayName,userid: profile.id }, function (err, user) {
         return done(err, user);
       });
  }
));

module.exports = passport;