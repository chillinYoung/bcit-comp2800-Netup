const LocalStrategy = require('passport-local').Strategy;
// we need to be checking if the email and username matches so we need db
const db = require('../db/mockDatabase');

// load users from db
const users = db.users;

// the passport we are passing in is going to be in the main index.js file
// that's also why we didn't need require the passport module here
module.exports = function(passport) {
  passport.use(
    new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
      let foundUser = null;
      error = '';
      users.forEach(user => {
        if(user.email === email && user.password === password) {
          foundUser = user;
        } else {
          if (user.email !== email) {
            error = "email is not registered"
          }

          if (user.password !== password) {
            error = "password is not registered"
          }
        }
      });

      if(foundUser) {
        return done(null, foundUser, {message: "Welcome back"})
      } else {
        return done(null, false, {message: error});
      }

    })
  );

  // need to serializeUser

  passport.serializeUser((user, done) => {
    console.log(user);
    done(null, user.id);
  })

  // need to deserializeUser
  passport.deserializeUser((id, done) => {
    let foundUser = null;
    users.forEach(user => {
      if(user.id === id) {
        console.log("user id: " + user.id)
        console.log("id: " + id)
        foundUser = user;
      }
    })
    done(null, foundUser);
  })
}
