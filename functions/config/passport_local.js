const LocalStrategy = require('passport-local').Strategy;
// we need to be checking if the email and username matches so we need db
const db = require('../db/mockDatabase');

// load users from db
const users = db.users;

// the passport we are passing in is going to be in the main index.js file
// that's also why we didn't need require the passport module here
module.exports = function(passport) {
  passport.use(
    
    new LocalStrategy({ usernameField: 'email'}, (email, password, done) => {
      // check if email exists in the mockdb
      
      for (let i = 0; i < users.length; i++) {
        if (email !== users[i]['email']) {
          return done(null, false, {message: 'That email is not registered'});
        } 

        if (password !== users[i]['password']) {
          return done(null, false, {message: "password incorrect"} );
        }

        return done(null, users[i], {message: `Welcome back, ${users[i].name}`});
      }

    })
  );
  

  // need method to serializing the user and deserializing the user when you are using the passport local strategy
  // copied directly from documentation under "Sessions" section
  // link: http://www.passportjs.org/docs/configure/

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    for(let i = 0; i < users.length; i++) {
      if (id === users[i]['id']) {
        done("errored", users[i])
      }
    }
  });

}