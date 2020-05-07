const userController = require("./userRoute");

// initialize our mock database
const db = require("../db/mongooseSchema");

// load users from db

module.exports = {
  createAccount: (req, res) => {
    const { fname, lname, email, pw1, pw2 } = req.body;
    let errors = [];
    console.log(req.body);
    // check if passwords match
    if (pw1 !== pw2) {
      errors.push({ msg: "Passwords must match" });
      console.log(errors);
    }

    // check if passwords are at least 6 characters long
    if (pw1.length <= 6 || pw1.length >= 10) {
      errors.push({ msg: "Passwords must be between 6 - 10 characters" });
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

      db.User.find({}, (err, results) => {
        if (!err) {
          let users = Array.from(results);

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
            let newUser = new db.User({
              name: `${fname} ${lname}`,
              email: email,
              password: pw1,
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
        } else {
          res.send(err);
        }
      });
    }
  },
};
