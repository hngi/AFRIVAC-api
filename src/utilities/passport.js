const passport = require('passport');
const GooglePlusTokenStrategy = require('passport-google-plus-token');
const User = require('./Models/authModel');
const Profile = require('./Models/profileModel');

// Google OAuth Strategy
passport.use(
  'googleToken',
  new GooglePlusTokenStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Should have full user profile over here
        console.log('profile', profile);
        console.log('accessToken', accessToken);
        console.log('refreshToken', refreshToken);
        const name = profile.name.givenName+ " "+profile.name.familyName
        const existingUser = await User.findOne({ 'google.id': profile.id });
        if (existingUser) {
          return done(null, existingUser);
        }

        const newUser = new User({
          method: 'google',
          google: {
            id: profile.id,
            email: profile.emails[0].value,
          },
        });
        //@omodauda create a profile for a user registering with Google oauth
        const newProfile = new Profile({
          userId: newUser._id,
          email: profile.emails[0].value,
          name: name,
          gender: "others"
        });

        await newProfile.save();
        await newUser.profile.push(newProfile);
        await newUser.save();
        return done(null, newUser);
      } catch (error) {
        return done(error, false, error.message);
      }
    }
  )
);

