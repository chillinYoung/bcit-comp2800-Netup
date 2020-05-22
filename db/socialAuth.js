const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const schema = require("./mongooseSchema");

const User = schema.User


// Module for social media login logic.

module.exports = {
    // Configure passport to use the google sign-in api wit hthe correct credentials.
    googleSetup: passport.use(new GoogleStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "https://dtc10-netup.herokuapp.com/auth/google/secrets",
        userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
      },
            // Logic for bringing up the google sign-in interface to the screen.
      function(accessToken, refreshToken, profile, cb) {
        // Creates a user in the database for the logged-in gmail account.
        User.findOrCreate({ googleId: profile.id, name: profile.displayName }, function (err, user) {
          return cb(err, user);
        });
      }
      )),
      // Callback function for responding to a user signing in.
      getGoogleSigninRoute: passport.authenticate('google', { scope: ["profile"] }),
      googleCallback:  passport.authenticate('google', { failureRedirect: "/login" }),
      function(req, res) {
        // Successful authentication, redirect to myEvents.
        res.redirect("/myEvents");
      },
      // Prepare passport to use github sign-in api with the correct credentials.
      githubSetup:  passport.use(new GitHubStrategy({
        clientID: process.env.GITHUBID,
        clientSecret: process.env.GITHUBSECRET,
        callbackURL: "https://dtc10-netup.herokuapp.com/auth/github/callback"
      },
        // Creating a new user in the database for this github account.
      function(accessToken, refreshToken, profile, cb) {
        User.findOrCreate({ githubId: profile.id, name: profile.displayName }, function (err, user) {
          return cb(err, user);
        });
      }
      )),
      //  Set up Github-login.
      authenticateGithub: passport.authenticate('github'),
    //   Callback function for after user signs in with Github.
      githubCallback: passport.authenticate('github', { successRedirect : '/myEvents', failureRedirect: '/login' }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/myevents');
      }
}