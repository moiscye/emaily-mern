const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const keys = require("../config/keys");

//loading users model
const mongoose = require("mongoose");
const User = mongoose.model("users");

//this code will run after authentication the google strategy
//this line will add a cookie or token so the user can log back in
passport.serializeUser((user, cb) => {
  cb(null, user);
});

//this code will take the id that the user will
//will be explained further
passport.deserializeUser((id, cb) => {
  User.findById(id).then(user => {
    cb(null, user);
  });
});

passport.use(
  //configuration of the client and the redirect callback
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: "/auth/google/callback"
    },
    (accessToken, refreshToken, profile, cb) => {
      User.findOne({ googleId: profile.id }).then(existingUser => {
        if (existingUser) {
          //already in DB
          console.log("user already in DB");

          cb(null, existingUser);
        } else {
          new User({ googleId: profile.id }).save().then(user => {
            console.log("creating user in DB");
            cb(null, user);
          });
        }
      });
    }
  )
);
