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
      users.forEach(user => {
        if (user.email !== email) {
          return done(null, false, {message: "email is not registered"});
        }

        if (user.password !== password) {
          return done(null, false, {message: "password is not correct"});
        }

        foundUser = user;
        return done(null, foundUser, {message: `welcome back ${user.name}`});
      })

    })
  );

  // need to serializeUser

  passport.serializeUser((user, done) => {
    done(null, user.id);
  })

  // need to deserializeUser
  passport.deserializeUser((id, done) => {
    let foundUser = null;
    users.forEach(user => {
      if(user.id === id) {
        foundUser = user;
      }
    })
    done(null, foundUser);
  })
}