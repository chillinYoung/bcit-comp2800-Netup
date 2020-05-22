const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github').Strategy;


module.exports = {
    googleSetup: passport.use(new GoogleStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "https://dtc10-netup.herokuapp.com/auth/google/secrets",
        userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
      },
      function(accessToken, refreshToken, profile, cb) {
        console.log(profile);
      
        // Creates a user in the database for the logged-in gmail account.
        User.findOrCreate({ googleId: profile.id, name: profile.displayName }, function (err, user) {
          return cb(err, user);
        });
      }
      )),
      getGoogleSigninRoute: passport.authenticate('google', { scope: ["profile"] }),
      googleCallback:  passport.authenticate('google', { failureRedirect: "/login" }),
      function(req, res) {
        console.log(req.user)
        // Successful authentication, redirect to myEvents.
        res.redirect("/myEvents");
      },
      githubSetup:  passport.use(new GitHubStrategy({
        clientID: process.env.GITHUBID,
        clientSecret: process.env.GITHUBSECRET,
        callbackURL: "http://dtc10-netup.herokuapp.com/auth/github/callback"
      },
        // Creating a new user in the database for this github account.
      function(accessToken, refreshToken, profile, cb) {
        User.findOrCreate({ githubId: profile.id, name: profile.displayName }, function (err, user) {
          return cb(err, user);
        });
      }
      )),
      authenticateGithub: passport.authenticate('github'),
      githubCallback: passport.authenticate('github', { successRedirect : '/myEvents', failureRedirect: '/login' }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/myevents');
      }
}