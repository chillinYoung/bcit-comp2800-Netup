const userController = require("./userRoute");
const md5 = require("md5");

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
            let newUser = new schema.User({
              name: `${fname} ${lname}`,
              email: email,
              password: md5(pw1),
              interests: [],
              hostedEvents: [],
              joinedEvents: [],
            });
            newUser.save((err) => {
              if (!err) {
                console.log("Successfully added new user!");
              } else {
                console.log(err);
              }
            });

            req.flash("success_msg", "Successfully created account");
            res.redirect("/");
          }
        }
      } else {
        res.send(err);
      }
    });
  },
};
