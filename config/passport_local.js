const db = require("../db/mongooseSchema");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

// the passport we are passing in is going to be in the main index.js file
// that's also why we didn't need require the passport module here
module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      // find the list of users from the User collection
      db.User.find({}, (err, results) => {
        if (!err) {
          let users = Array.from(results);

          let foundUser = null;
          error = "";
          
          users.forEach((user) => {
              if (user.email === email) {
                foundUser = user;
              } else {
                error = "user isn't registered"
              }
          });

          if (foundUser) {

            // check if user has validated email?

            if (foundUser.isEmailVerified) {
            
              bcrypt.compare(password, foundUser.password, function(err, result) {
                if (result == true) {
                  return done(null, foundUser, { message: `Welcome back ${foundUser.name}` });
                } else {
                  error = "password does not match";
                  return done(null, false, { message: error });
                }
              });
            } else {
              // user hasn't verified email yet
              error = "You need to verify email before you can login"
              return done(null, false, {message: error});
            }

          } else {
            console.log("user is not in the db");
            return done(null, false, { message: error });
          }

        } else {
          // if there's error from retrieving information from User collection
          console.log(err);
        }
      });
      //last
    })
  );

  // need to serializeUser

  passport.serializeUser((user, done) => {
    console.log(user);
    done(null, user.id);
  });

  // need to deserializeUser
  passport.deserializeUser((id, done) => {
    db.User.find({}, (err, results) => {
      if (!err) {
        let users = Array.from(results);

        let foundUser = null;
        users.forEach((user) => {
          if (user.id === id) {
            foundUser = user;
          }
        });
        done(null, foundUser);
      } else {
        res.send(err);
      }
    });
  });
};
