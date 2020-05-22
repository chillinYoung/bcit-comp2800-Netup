const userController = require("../controller/userRoute");
const db = require("../model/mongooseSchema");
const nodemailer = require('nodemailer');

// 
//Instruction for using mongoose and mongoDB from Complete Web Development bootcamp on Udemy.
// Available at https://www.udemy.com/course/the-complete-web-development-bootcamp/.

// Stores all the mongoDB related functions inside an object.
let mongooseFunctions = {
  // Retreives all the events in the database.
  getEvent: (req, res) => {
    db.Event.find({}, (err, foundEvents) => {
      if (!err) {
        res.send(foundEvents);
      } else {
        res.send(err);
      }
    });
  },
  // Create a new event in the database.
  postEvent: function (req, res) {
    const newEvent = new db.Event({
      image: req.body.image,
      eventTopic: req.body.eventTopic,
      eventName: req.body.eventName,
      hostName: req.body.hostName,
      eventDate: req.body.eventDate,
      eventTime: req.body.eventTime,
      duration: req.body.duration,
      description: req.body.description,
    });
    // Saves an event in the database.
    newEvent.save((err) => {
      if (!err) {
        res.send("Successfully added a new Event!!");
      } else {
        res.send(err);
      }
    });
  },
  // Deletes all the event in the database.
  deleteEvent: (req, res) => {
    db.Event.deleteMany(function (err) {
      if (!err) {
        res.send("Successfully deleted all events");
      } else {
        res.send(err);
      }
    });
  },
  // Logic for setting up the 'my events' page with all the necessary information.
  prepareEvent: (req, res) => {
    db.Event.find({}, (err, foundEvent) => {
      if (!err) {
        // console.log(Array.from(foundEvent))
        res.render("pages/myEvents", {
          user: userController.isLoggedIn(req.user),
          currentUser: req.user,
          events: Array.from(foundEvent),
        });
      } else {
        res.send(`LOGGING DATABASE ERROR ${err}`);
      }
    });
  },
    // Create a new User in the database.
  postUser: function (req, res) {
    let newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      interests: req.body.interests,
      hostedEvents: req.body.hostedEvents,
      joinedEvents: req.body.joinedEvents,
    });
    // Saves the user in MongoDB atlas.
    newUser.save((err) => {
      if (!err) {
        res.send("Successfully added new user!");
      } else {
        res.send(err);
      }
    });
  },
  // Locate a specific event in the database and send all the
  findEvent: function (req, res) {
    db.Event.findOne({ _id: req.params.eventId }, (err, foundEvent) => {
      if (foundEvent) {
        res.send(foundEvent);
      } else {
        res.send("No articles matching that title was found.");
      }
    });
  },
  // Edit an event in the database.
  updateEvent: (req, res) => {
    db.Event.updateOne(
      { _id: req.params.eventId },
      { $set: req.body }, (err) => {
      if (!err) {
        res.redirect("/myEvents");
        // res.send("Successfully updated event!");
      } else {
        res.send(err);
      }
    });
  },
  // Delete a specific event from the database.
  deleteEvent: (req, res) => {
    db.Event.deleteOne({ _id: req.params.eventId }, function (err) {
      if (!err) {
        res.redirect("/myEvents");
      } else {
        res.send(err);
      }
    });
  },
  // Allow a user to leave an event they previously joined.
  leaveEvent: (req, res) => {
    // Updates the specific event document to no longer list the userId as a participant.
    db.Event.updateOne({ _id: req.params.eventId }, {$pull: {participants: req.user.id}}, function (err) {
      if (!err) {
        console.log("Successfully left event!")
      } else {
        res.send(err);
      }
    });
    // Updates the specific user document to no longer list the eventId as a joined event.
    db.User.updateOne({_id: req.user.id}, {$pull: {joinedEvents: req.params.eventId}}, (err)=> {
      if (!err) {
        res.redirect("/myEvents")
      } else {
        res.send(err);
      }
    })
  },
  // Finds a specific user in the database.
  findUser: function (req, res) {
    db.User.findOne({ _id: req.params.userId }, (err, foundUser) => {
      if (foundUser) {
        res.send(foundUser);
      } else {
        res.send("No articles matching that user was found.");
      }
    });
  },
  // Edits the user information in the database.
  updateUser: (req, res) => {
    db.User.update({ _id: req.params.userId }, { $set: req.body }, (err) => {
      if (!err) {
        res.send("Successfully updated user!");
      } else {
        res.send(err);
      }
    });
  },
  // Sets up the index page with all the necessary information, such as all the events in our database,
  // If the user is logged in or not, and the user's information.
  setUpIndex: (req, res) => {
    db.Event.find({}, (err, foundEvents) => {
      res.render("pages/index", {
        events: foundEvents,
        user: userController.isLoggedIn(req.user),
        currentUser: req.user
      });
    });
  },
  // Logic for letting a user join an event.
  joinEvent: (req, res) => {
    if (!req.user) {
      console.error(err)
    } else {
      // Update the event to list the user as one of its participants in the database.
    db.Event.updateOne({ _id: req.body.id }, {$push: {participants: req.user.id}},(err) => {
      if (err) {
        res.send(err)
      } 
    });
    // Update the user to list the event as one of its joined events.
    db.User.updateOne({ _id: req.user.id }, {$push: {joinedEvents: req.body.id}},(err) => {
      if (err) {
        res.send(err);
      } 
    }).then(result => res.json('Success'))
    .catch(error => console.error(error));
  }
  },
  // Logic for the contact form and sending an email to netupTestEmail@gmail.com with any feedback.
  contactForm: (req, res) => {
    const output = `
      <p>You have a new contact request</p>
      <h3>Contact Details</h3>
      <ul>  
        <li>Name: ${req.body.name}</li>
        <li>Company: ${req.body.company}</li>
        <li>Email: ${req.body.email}</li>
        <li>Phone: ${req.body.phone}</li>
      </ul>
      <h3>Message</h3>
      <p>${req.body.message}</p>
    `;  
    // Use the nodemailer api to send an email.
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      secure: false, // true for 465, false for other ports
      auth: {
          user: 'netupTestEmail@gmail.com', // generated ethereal user
          pass: 'Netup123@'  // generated ethereal password
      },
      tls:{
        rejectUnauthorized:false
      }
    });
  
    // setup email data with unicode symbols
    let mailOptions = {
        from: `"Nodemailer Contact" ${req.body.email}`, // sender address
        to: 'netupTestEmail@gmail.com', // list of receivers
        subject: 'User Contact Request', // Subject line
        text: 'Feedback sent!', 
        html: output 
    };
  
    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);   
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        res.render('pages/contact', { success: "Thanks for your feedback, message sent to Netup Team" });
    });
  },
  // Set up the Allevents page to display all the events in the database.
  getAllEvents: (req, res) => {
    db.Event.find({}, (err, foundEvents) => {
      res.render("pages/allEvents", {
        events: foundEvents,
        user: userController.isLoggedIn(req.user),
        currentUser: req.user,
        topic: "all topics"
      });
    });
  },
  // Logic for filtering the events displayed in the events section by topic.
  getEventByTopics: (req, res) => {
    let chosenTopic = req.params.topic;
    db.Event.find({eventTopic: chosenTopic})
    .then(result => {
      res.render("pages/allEvents", {
        events: result,
        user: userController.isLoggedIn(req.user),
        currentUser: req.user,
        topic: chosenTopic
      })
    })
  .catch(error => console.error(error));
  },
  // Get the details about a specific event from the database.
  getEvent: (req, res) => {
    // console.log(req.params.eventId);
    db.Event.find({"_id": req.params.eventId})
    .then(result => {
      res.render("pages/eventDetails", {
        events: result[0],
        user: userController.isLoggedIn(req.user),
        currentUser: req.user
      })
    })
    .catch(error => console.error(error));
  },
  // Edit an event in the database to have new information.
  editEvent: (req, res) => {
    // console.log(req.params.eventId);
    db.Event.find({"_id": req.params.eventId})
    .then(result => {
      res.render("pages/editEvent", {
        events: result[0],
        user: userController.isLoggedIn(req.user)
      })
    })
    .catch(error => console.error(error));
  }
};

// Export all of the functions in this module.
module.exports = mongooseFunctions;
