const userController = require("./userRoute");
const bcrypt = require("bcrypt");
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const saltRounds = 10;


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
            bcrypt.hash(pw1, saltRounds, function(err, hash) {

                let newUser = new schema.User({
                  name: `${fname} ${lname}`,
                  email: email,
                  password: hash,
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
                let emailBody = `
            
                  <h1> Welcome to Netup </h1>

                  <p> Please click the link below to verify your email <p>
                  <p> It will expire after 5 minutes </p>
                  
                  <a href="http://localhost:5050/confirmation/${newTempUser.token}">Verification link here</a> 
                `

                const transporter = nodemailer.createTransport({
                  host: "smtp.ethereal.email",
                  port: 587,
                  secure: false,
                  auth: {
                    user: "estell.will@ethereal.email",
                    pass: "HBEB2ufzXwuH8rttgf"
                  },
                  tls: {
                    rejectUnauthorized: false
                  }
                });

                const mailOPtions = {
                  from: "estell.will@ethereal.email",
                  to: email,
                  subject: "testing verification email",
                  html: emailBody
                }

                transporter.sendMail(mailOPtions, (error, info) => {
                  if (error) {
                    return console.log(error);
                  }
                  console.log('Message sent: %s', info.messageId);   
                  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                  
                  req.flash("success_msg", "Please verify your email before login");
                  res.redirect("/");
              });   
            });
          }
        }
      } else {
        res.send(err);
      }
    });
  },
};
