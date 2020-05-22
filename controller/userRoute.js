let schema = require("../model/mongooseSchema");
const sendEmail = require("../controller/sendEmail");
const crypto = require('crypto');
const passport = require('passport');

//Module for logging users in to the site.

module.exports = {
  isLoggedIn: (user) => {
    return user ? false : true;
  },
  userDetails: (user) => {
    return user
  },
  loginPost: (req, res, next) => { 
    passport.authenticate('local', function(err, user, info) {
      
      // if there's error with passport local, just return
      if (err) { return next(err); }
      
      // if passport local doesn't return the user object (aka user == false)
      // then i want to customize the behavior here for the redirect
      if (!user) { 
        
        if(info.message.indexOf("verify") !== -1) {
          req.flash("error", info.message);
          return res.redirect('/resend');
        } else {
          req.flash("error", info.message);
          return res.redirect('/login'); 
        }
      }
      
      // if passport returns the user object, then we can log user in
      req.logIn(user, function(err) {
        if (err) { return next(err); }
        req.flash("success", info.message);
        return res.redirect('/myEvents');
      });
      
    })(req, res, next);
  },
  createEvent: (req, res) => {
    console.log(req.user);
    const {
      eventTopic,
      eventName,
      eventDate,
      eventTime,
      eventDuration,
      eventDetails,
    } = req.body;
    let userExistingEvents = null;
    const hostName = req.user.name;
    const hostId = req.user._id;
    console.log(req.user.name);
    // check user db to make sure no conflicting events hosted by same user

    let newEvent = new schema.Event({
      eventTopic: eventTopic,
      eventName: eventName,
      hostName: hostName,
      hostId: hostId,
      duration: eventDuration,
      description: eventDetails,
      participants: [],
      eventDate: eventDate,
      eventTime: eventTime,
      image: "/src/assets/images/yoga.jpg",
    });
    // Find the user collection in the database and find the specific user who created this event,
    // and then find all the other events created by this user and store in a variable called userExisting events.
    schema.User.find({}, (err, foundUser) => {
      if (!err) {
        let users = Array.from(foundUser);
        users.forEach((user) => {
          if (user._id === hostId) {
            userExistingEvents = user.hostedEvents;
          }
        });
      } else {
        console.log(err);
      }
    });
    // checking if there's any events user already hosting
    if (userExistingEvents) {
      // check if the new event matches any event inside of the user hosted events
      let isExitingEvent = false;
      userExistingEvents.forEach((event) => {
        if (event.eventDate === eventDate && event.eventTime === eventTime) {
          isExitingEvent = true;
        }
      });

      if (isExitingEvent) {
        // it will cause an error message to show if the event already exists
        req.flash("error", "You already created this same event");
        // res.render('pages/myevents', {user: userController.isLoggedIn(req.user)});
        res.redirect("/create");
      } else {
        // if no event conflict, then save the new event to events collection in the MongoDB atlas database.
        // if no event conflict, then add event to user.hosted event document

        newEvent.save((err) =>
          err ? console.log(err) : console.log("Successfully added new user.")
        );

        schema.User.find({ name: newEvent.hostName }, (err, foundUser) => {
          foundUser.hostedEvents.push(newEvent);
        });

        req.user.hostedEvents.push(newEvent);
        console.log(req.user);
        req.flash("success_msg", "Event added!");
        res.redirect("/myevents");
      }
    } else {
      // if user doesn' even have any existing events, then add to events
      // and to their hostedEvents document
      newEvent.save((err) =>
        err ? console.log(err) : console.log("Successfully added new user.")
      );
      req.user.hostedEvents.push(newEvent);
      console.log(req.user);
      req.flash("success_msg", "Event added!");
      res.redirect("/myevents");
    }
  }, 

  // EMAIL VERIFICATION FUNCTIONALITY
  // confirmation function for email verification
  confirmation: (req, res) => {
    let hash = req.params.hash
    schema.TempUser.findOne({token: hash}, (err, tempUser) => {
      if(tempUser) {
        // finds the temp user meaning the verification hasn't expired
        const userId = tempUser._userId;
      
        schema.User.findOneAndUpdate({_id: userId},
          {isEmailVerified: true}, (err, user) => {
            if(user) {
              console.log(user);
            } else {
              console.log(err);
            }
          })
        
        // user can now be sent to the login page to login
        req.flash("success_msg", "Thank you for verifying your email! Login now!")
        res.redirect('/login')

      } else {
        let error = "validation link expired"
        res.render('./pages/resend', {error: error});
        // the link has expired, user should enter their email again
      }
    })
  },

  // EMAIL VERIFICATION FUNCTIONALITY
  // here's the callback for user to get a new verification email sent to them
  resend: (req, res) => {
    const { email } = req.body;

    // find the user with this email in the db
    schema.User.findOne({email: email}, (err, user) => {
      if(user) {

          // create a new tempUser entry based on the user id
          const newTempUser = new schema.TempUser({
            _userId: user._id,
            token: crypto.randomBytes(16).toString('hex')
          })

          // saves the tempUser in the db
          newTempUser.save();

          // send email to the user again
         sendEmail(email, newTempUser.token, req, res);

      } else {
        req.flash("error", "No user with this email, please sign up first");
        res.redirect('/signup');
      }
    })
   
  }
};
