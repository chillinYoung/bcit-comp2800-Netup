let db = require("../db/mockDatabase");
let schema = require("../db/mongooseSchema");

module.exports = {
  isLoggedIn: (user) => {
    return user ? false : true;
  },
  userDetails: (user) => {
    return user
  }
  ,
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
      id: db.events.length + 1,
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
        // if no event conflict, then add event to events collection
        // if no event conflict, then add event to user.hosted event document

        newEvent.save((err) =>
          err ? console.log(err) : console.log("Successfully added new user.")
        );
        db.events.push(newEvent);

        schema.User.find({ name: newEvent.hostName }, (err, foundUser) => {
          foundUser.hostedEvents.push(newEvent);
        });

        req.user.hostedEvents.push(newEvent);
        console.log(db.events);
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
      db.events.push(newEvent);
      req.user.hostedEvents.push(newEvent);
      console.log(db.events);
      console.log(req.user);
      req.flash("success_msg", "Event added!");
      res.redirect("/myevents");
    }
  }, 

  // confirmation function
  confirmation: (req, res) => {
    let hash = req.params.hash
    TempUser.findOne({token: hash}, (err, tempUser) => {
      if(tempUser) {
        // finds the temp user meaning the verification hasn't expired
        const userId = tempUser._userId;

        User.findOneAndUpdate({_id: userId},
          {isEmailVerified: true}, (err, user) => {
            if(user) {
              console.log(user);
            } else {
              console.log(err);
            }
          })
        
        // user can now be sent to the login page to login
        res.redirect('/login.html')

      } else {
        res.send("we will redirect to get request at this time")
        // the link has expired, user should enter their email again
      }
    })
  },

  // here's the callback for user to get a new verification email sent to them
  resend: (req, res) => {
    const { email } = req.body;

    // find the user with this email in the db
    User.findOne({email: email}, (err, user) => {
      if(user) {

          // create a new tempUser entry based on the user id
          const newTempUser = new TempUser({
            _userId: user._id,
            token: crypto.randomBytes(16).toString('hex')
          })

          // saves the tempUser in the db
          newTempUser.save();

          // send email to the user again

          let emailBody = `
              
          <h1> Welcome to Netup </h1>

          <p> Please click the link below to verify your email <p>
          <p> It will expire after 5 minutes </p>
          
          <a href="http://localhost:5000/confirmation/${newTempUser.token}">Verification link here</a> 
          `

          // created TestAccount since I don't have a real mail account yet
        
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
            
            res.send("Please check your email to verify before you can login")
          });

      } else {
        res.send("There's no user currently with this account, create account first")
      }
    })
   
  }
};
