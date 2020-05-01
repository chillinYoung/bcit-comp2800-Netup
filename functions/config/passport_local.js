const LocalStrategy = require('passport-local').Strategy;
// we need to be checking if the email and username matches so we need db
const db = require('./db/mockDatabase');

// we need to unhash the password to compare so we need to bring in bcrypt
const bcrpyt = require('bcryptjs');

// load users from db

const users = db.users;

// the passport we are passing in is going to be in the main index.js file
// that's also why we didn't need require the passport module here
module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email'}, (email, password, done) => {
      // check if email exists in the mockdb
      

      User.findOne( { email: email })
      .then(user => {
        if (!user) {
          return done(null, false, { message: 'That email is not registered'});
        }

        // Match password
        // need to use bcrypt here
        bcrpyt.compare(password, user.password, (error, isMatch) => {
          if (error) throw error;

          if(isMatch) {
            return done(null, user, {message: `Welcome back, ${user.username}`});
          } else {
            return done(null, false, { message: "Password incorrect"});
          }
        })
      })
      .catch(error => console.log(error))

    })
  );
  

  // need method to serializing the user and deserializing the user when you are using the passport local strategy
  // copied directly from documentation under "Sessions" section
  // link: http://www.passportjs.org/docs/configure/

  passport.serializeUser((user, done) => {
  done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

}