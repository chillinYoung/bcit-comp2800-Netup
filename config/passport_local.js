const db = require("../db/mongooseSchema");
const LocalStrategy = require("passport-local").Strategy;

// the passport we are passing in is going to be in the main index.js file
// that's also why we didn't need require the passport module here
module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      db.User.find({}, (err, results) => {
        if (!err) {
          let users = Array.from(results);

          let foundUser = null;
          error = "";
          users.forEach((user) => {
            if (user.email === email && user.password === password) {
              foundUser = user;
            } else {
              if (user.email !== email) {
                error = "email is not registered";
              }

              if (user.password !== password) {
                error = "password does not match";
              }
            }
          });

          if (foundUser) {
            return done(null, foundUser, { message: "Welcome back" });
          } else {
            return done(null, false, { message: error });
          }
        } else {
          res.send(err);
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
            console.log("user id: " + user.id);
            console.log("id: " + id);
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
