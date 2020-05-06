const userController = require('./userRoute');

// initialize our mock database
let db = require("../db/mockDatabase");

module.exports = {
  createAccount: (req, res) => {
    const { fname, lname, email, pw1, pw2 } = req.body;
    let errors = [];
    console.log(req.body);
    // check if passwords match
    if (pw1 !== pw2) {
      errors.push({msg: "Passwords must match"})
      console.log(errors)
    }
  
    // check if passwords are at least 6 characters long
    if (pw1.length <= 6 || pw1.length >= 10) {
      errors.push({msg: "Passwords must be between 6 - 10 characters"})
      console.log(errors)
    }
  
    if (errors.length > 0) {
      console.log("THERE ARE ERRORS");
      res.render('pages/signup', {
        errors,
        fname,
        lname,
        email,
        pw1,
        pw2,
        user: userController.isLoggedIn(req.user)
      });
    } else {
      // check db if user exist
      let userFound = null;
      db.users.forEach(user => {
        if (user.email === email) {
          userFound = true;
        }
      });
      
      if(userFound) {
        // user found, send error and response
        errors.push({msg: "user exists"});
        res.render('pages/signup', {
          errors,
          fname,
          lname,
          email,
          pw1,
          pw2,
          user: userController.isLoggedIn(req.user)
        });
      } else {
        
        // user not found, free to update db
        db.users.push({
          id: db.users.length + 1,
          name: `${fname} ${lname}`,
          email: email,
          password: pw1,
          interests: [],
          hostedEvents: [],
          joinedEvents: []
        })
        req.flash('success_msg', "Successfully created account");
        res.redirect('/');
  
      }
  
    }
  }
}
