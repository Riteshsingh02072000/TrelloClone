// config/passport.js
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const User = require('../models/Users.js');
// require('./config/passport')(passport);
// src/backend/config/passport.js


module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/auth/google/callback', // Ensure this matches your Google Cloud Console settings
      },
      async (accessToken, refreshToken, profile, done) => {
        const { id, displayName, emails } = profile;
        const email = emails[0].value;

        try {
          let user = await User.findOne({ googleId: id });

          if (user) {
            // User exists
            return done(null, user);
          } else {
            // Check if a user with the same email exists
            user = await User.findOne({ email });

            if (user) {
              // Link Google account
              user.googleId = id;
            } else {
              // Create new user
              user = new User({
                googleId: id,
                fullName: displayName,
                email: email,
              });
            }

            await user.save();
            return done(null, user);
          }
        } catch (err) {
          console.error(err);
          return done(err, null);
        }
      }
    )
  );

  // Serialize user for session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize user from session
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};
