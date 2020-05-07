const express = require('express');
const ejsLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const PORT = 5050;

// importing custom modules
const checkAuth = require("./config/auth").ensureAuthenticated;
const userController = require("./controller/userRoute");
const mainController = require("./controller/mainRoute");

// instantiate express app
const server = express();

// set up to use static files
server.use(express.static("public"));

// ejs middleware
server.use(ejsLayouts);
server.set("views", "./views");
server.set("view engine", "ejs");

// PASSPORT CONFIGURATION - FOR AUTHENTICATION
require("./config/passport_local")(passport);

// EXPRESS-SESSION MIDDLEWARE ***********************************************************
// it's a dependency for both passport and connect-flash messaging

server.set("trust proxy", 1); // trust first proxy
server.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
  })
);

// PASSPORT MIDDLEWARE *******************************************************************
// dependent on express session so must put this middleware after express-session
server.use(passport.initialize());
server.use(passport.session());

// REGISTRATION AND LOGIN ****************************************************************
// this is used to parse form information so that we can see POST requests in json format
// body parser

server.use(express.json());
server.use(express.urlencoded({ extended: false }));

// CONNECT-FLASH MIDDLEWARE **************************************************************
server.use(flash());

// CUSTOM MIDDLEWARE *********************************************************************

server.use((req, res, next) => {
  // THIS IS FOR THE CREATE ACCOUNT MESSAGES

  res.locals.success_msg = req.flash("success_msg");
  // this is for the create account page error messages
  res.locals.error_msg = req.flash("error_msg");

  // THIS IS FOR THE AUTHENTICATION ERROR / SUCCESS MESSAGES FROM PASSPORT
  // global variable for the flash error for passport just returns an error
  res.locals.error = req.flash("error");
  // global variable for the flash error for passport when login succeeded
  res.locals.success = req.flash("success");

  next();
});
const mongooseFunctions = require("./db/mongooseFunctions");

// Connect to events collection in database with mongodb.
server
  .route("/events")
  .get(mongooseFunctions.getEvent)
  .post(mongooseFunctions.postEvent)
  .delete(mongooseFunctions.deleteEvent);

// connect with users collection in mongoDB.
server
  .route("/users")
  .get(mongooseFunctions.getUser)
  .post(mongooseFunctions.postUser)
  .delete(mongooseFunctions.deleteUser);

// Connect with a specific event in events collection.
server
  .route("/events/:eventId")
  .get(mongooseFunctions.findEvent)
  .put(mongooseFunctions.replaceEvent)
  .patch(mongooseFunctions.updateEvent)
  .delete(mongooseFunctions.deleteEvent);

// Interact with specific user in users collection
server
  .route("/users/:userId")
  .get(mongooseFunctions.findUser)
  .put(mongooseFunctions.replaceUser)
  .patch(mongooseFunctions.updateUser)
  .delete(mongooseFunctions.deleteUser);

//index handle
server.get("", mongooseFunctions.setUpIndex);

// login handle
server.get("/login", (req, res) => {
  res.render("pages/login", { user: userController.isLoggedIn(req.user) });
});

// signup handle
server.get("/signup", (req, res) => {
  res.render("pages/signup", { user: userController.isLoggedIn(req.user) });
});

// registration (signup) handle
// TODO: NEED TO UPDATE WHEN ACTUAL DB IS READY
server.post("/signup", mainController.createAccount);

// create event page
server.get("/create", (req, res) => {
  res.render("pages/createEvent", {
    user: userController.isLoggedIn(req.user),
  });
});

// user account page handle
server.get("/myevents", mongooseFunctions.prepareEvent);

// signout handle
server.get("/signout", (req, res) => {
  req.logout();
  req.flash("success_msg", "Logged out successfully");
  res.redirect("/");
});

server.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/myevents",
    failureRedirect: "/login",
    failureFlash: true,
    successFlash: true,
  })(req, res, next);
});

server.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`)
})
