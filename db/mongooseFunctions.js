const userController = require("../controller/userRoute");
const db = require("./mongooseSchema");

let mongooseFunctions = {
  getEvent: (req, res) => {
    db.Event.find({}, (err, foundEvents) => {
      if (!err) {
        res.send(foundEvents);
      } else {
        res.send(err);
      }
    });
  },

  postEvent: function (req, res) {
    const newEvent = new db.Event({
      image: req.body.image,
      eventTopic: req.body.eventTopic,
      eventName: req.body.eventName,
      hostName: req.body.hostName,
      eventDate: req.body.eventDate,
      duration: req.body.duration,
      description: req.body.description,
    });
    newEvent.save((err) => {
      if (!err) {
        res.send("Successfully added a new Event!!");
      } else {
        res.send(err);
      }
    });
  },
  deleteEvent: (req, res) => {
    db.Event.deleteMany(function (err) {
      if (!err) {
        res.send("Successfully deleted all events");
      } else {
        res.send(err);
      }
    });
  },
  getUser: (req, res) => {
    User.find({}, (err, foundUsers) => {
      if (!err) {
        res.send(foundUsers);
      } else {
        res.send(err);
      }
    });
  },
  prepareEvent: (req, res) => {
    db.Event.find({}, (err, foundEvent) => {
      if (!err) {
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
  postUser: function (req, res) {
    let newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      interests: req.body.interests,
      hostedEvents: req.body.hostedEvents,
      joinedEvents: req.body.joinedEvents,
    });
    newUser.save((err) => {
      if (!err) {
        res.send("Successfully added new user!");
      } else {
        res.send(err);
      }
    });
  },
  deleteUser: (req, res) => {
    User.deleteMany(function (err) {
      if (!err) {
        res.send("Successfully deleted all articles");
      } else {
        res.send(err);
      }
    });
  },
  findEvent: function (req, res) {
    db.Event.findOne({ _id: req.params.eventId }, (err, foundEvent) => {
      if (foundEvent) {
        res.send(foundEvent);
      } else {
        res.send("No articles matching that title was found.");
      }
    });
  },
  replaceEvent: (req, res) => {
    db.Event.update(
      { _id: req.params.eventId },
      {
        image: req.body.image,
        alt: req.body.alt,
        eventTopic: req.body.eventTopic,
        eventName: req.body.eventName,
        hostName: req.body.hostName,
        participants: req.body.participants,
        eventDate: req.body.participants,
      },
      { overwrite: true },
      (err) => {
        if (!err) {
          res.send("Successfully updated event.");
        }
      }
    );
  },
  updateEvent: (req, res) => {
    db.Event.update({ _id: req.params.eventId }, { $set: req.body }, (err) => {
      if (!err) {
        res.send("Successfully updated event!");
      } else {
        res.send(err);
      }
    });
  },
  deleteEvent: (req, res) => {
    db.Event.deleteOne({ _id: req.params.eventId }, function (err) {
      if (!err) {
        res.redirect("/myevents");
      } else {
        res.send(err);
      }
    });
  },
  findUser: function (req, res) {
    db.User.findOne({ _id: req.params.userId }, (err, foundUser) => {
      if (foundUser) {
        res.send(foundUser);
      } else {
        res.send("No articles matching that user was found.");
      }
    });
  },
  replaceUser: (req, res) => {
    db.User.update(
      { _id: req.params.userId },
      {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        interests: req.body.interests,
        hostedEvents: req.body.hostedEvents,
        joinedEvents: req.body.joinedEvents,
      },
      { overwrite: true },
      (err) => {
        if (!err) {
          res.send("Successfully updated user.");
        }
      }
    );
  },
  updateUser: (req, res) => {
    db.User.update({ _id: req.params.userId }, { $set: req.body }, (err) => {
      if (!err) {
        res.send("Successfully updated user!");
      } else {
        res.send(err);
      }
    });
  },
  deleteUser: function (req, res) {
    db.User.deleteOne({ _id: req.params.userId }, function (err) {
      if (!err) {
        res.send("Successfully deleted user");
      } else {
        res.send(err);
      }
    });
  },
  setUpIndex: (req, res) => {
    db.Event.find({}, (err, foundEvents) => {
      res.render("pages/index", {
        events: foundEvents,
        user: userController.isLoggedIn(req.user),
      });
    });
  },
};

module.exports = mongooseFunctions;
