let db = require("../db/mockDatabase");

let schema = require("../db/mongooseSchema");

module.exports = {
  isLoggedIn: (user) => {
    return user ? false : true;
  },
  createEvent: (req, res) => {
    const {
      eventTopic,
      eventName,
      eventDate,
      eventDuration,
      eventDetails,
    } = req.body;
    let userExistingEvents = null;
    const hostName = req.user.name;
    console.log(req.user.name);
    // check user db to make sure no conflicting events hosted by same user

    let newEvent = {
      id: db.events.length + 1,
      eventTopic: eventTopic,
      eventName: eventName,
      hostName: hostName,
      eventDuration: eventDuration,
      eventDetails: eventDetails,
      participants: [],
      eventDate: eventDate,
    };

    db.users.forEach((user) => {
      if (user.name === hostName) {
        userExistingEvents = user.hostedEvents;
      }
    });

    // checking if there's any events user already hosting
    if (userExistingEvents.length > 0) {
      // check if the new event matches any event inside of the user hosted events
      let isExitingEvent = false;
      userExistingEvents.forEach((event) => {
        if (event.eventDate === eventDate) {
          isExitingEvent = true;
        }
      });

      if (isExitingEvent) {
        // it will cause an error message to show if the event already exists
        req.flash("error_msg", "You already created this same event");
        // res.render('pages/myevents', {user: userController.isLoggedIn(req.user)});
        res.redirect("/create");
      } else {
        // if no event conflict, then add event to events collection
        // if no event conflict, then add event to user.hosted event document
        db.events.push(newEvent);
        req.user.hostedEvents.push(newEvent);
        console.log(db.events);
        console.log(req.user);
        req.flash("success_msg", "Event added!");
        res.redirect("/myevents");
      }
    } else {
      // if user doesn' even have any existing events, then add to events
      // and to their hostedEvents document
      db.events.push(newEvent);
      req.user.hostedEvents.push(newEvent);
      console.log(db.events);
      console.log(req.user);
      req.flash("success_msg", "Event added!");
      res.redirect("/myevents");
    }
  },
};
