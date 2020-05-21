const userController = require("./userRoute");
const bcrypt = require("bcrypt");
const crypto = require('crypto');
const sendEmail = require('../controller/sendEmail');
const saltRounds = 10;

// Module for registering a new user and saving them in the database.

// initialize our mock database
const schema = require("../db/mongooseSchema");

// load users from db

module.exports = {
  createAccount: (req, res) => {
    schema.User.find({}, (err, results) => {
      if (!err) {
        let users = Array.from(results);
        const { fname, lname, email, pw1, pw2 } = req.body;
        let errors = [];
        console.log(req.body);
        // check if passwords match
        if (pw1 !== pw2) {
          errors.push({ msg: "Passwords must match" });
          console.log(errors);
        }

        // check if passwords are at least 6 characters long
        if (pw1.length < 8) {
          errors.push({ msg: "Password must be more than 8 characters" });
          console.log(errors);
        }

        if (errors.length > 0) {
          console.log("THERE ARE ERRORS");
          res.render("pages/signup", {
            errors,
            fname,
            lname,
            email,
            pw1,
            pw2,
            user: userController.isLoggedIn(req.user),
          });
        } else {
          // check db if user exist
          let userFound = null;
          users.forEach((user) => {
            if (user.email === email) {
              userFound = true;
            }
          });

          if (userFound) {
            // user found, send error and response
            errors.push({ msg: "user exists" });
            res.render("pages/signup", {
              errors,
              fname,
              lname,
              email,
              pw1,
              pw2,
              user: userController.isLoggedIn(req.user),
            });
          } else {
              // If the email doesn't exist in DB,
              //then can add the new user

          // User Bcrypt library to hash and salt the password (similar to encryption)
            // to protect the password in the database and keep it secure.
            bcrypt.hash(pw1, saltRounds, function(err, hash) {

                let newUser = new schema.User({
                  name: `${fname} ${lname}`,
                  email: email,
                  password: hash,
                  isEmailVerified: false,
                  interests: [],
                  hostedEvents: [],
                  joinedEvents: [],
                });

                // also create a tempUser for storing the token

                const newTempUser = new schema.TempUser({
                  _userId: newUser._id,
                  token: crypto.randomBytes(16).toString('hex')
                })

                newUser.save((err) => {
                  if (!err) {
                    console.log("Successfully added new user!");
                  } else {
                    console.log(err);
                  }
                });

                newTempUser.save((err) => {
                  if(!err) {
                    console.log("Successfully created new temporary user for email verification")
                  } else {
                    console.log(err);
                  }
                })

                // *** SETTING UP EMAIL TO SEND TO USER USING NODEMAILER *********
                sendEmail(email, newTempUser.token, req, res);
            });
          }
        }
      } else {
        res.send(err);
      }
    });
  },
};
