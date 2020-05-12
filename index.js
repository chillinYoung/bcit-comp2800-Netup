const express = require('express');
const ejsLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require('dotenv').config();
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');
const schema = require("./db/mongooseSchema");


// instantiate express app
const server = express();

let PORT = process.env.PORT;
if(PORT == null || PORT == "") {
  PORT = 5050;
}

server.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`)
})


// importing custom modules
const checkAuth = require("./config/auth").ensureAuthenticated;
const userController = require("./controller/userRoute");
const mainController = require("./controller/mainRoute");
const mongooseFunctions = require("./db/mongooseFunctions");

// set up to use static files
server.use(express.static("public"));

// ejs middleware
server.use(ejsLayouts);
server.set("views", "./views");
server.set("view engine", "ejs");
server.use(bodyParser.urlencoded({
  extended: true
}));

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
const User = schema.User


// Passport connection to google credentials
passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: "http://localhost:5050/auth/google/secrets",
  userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
},
function(accessToken, refreshToken, profile, cb) {
  console.log(profile);

  User.findOrCreate({ googleId: profile.id, name: profile.displayName }, function (err, user) {
    return cb(err, user);
  });
}
));

// Google authemtication route.
server.get("/auth/google",
  passport.authenticate('google', { scope: ["profile"] })
);

server.get("/auth/google/secrets",
  passport.authenticate('google', { failureRedirect: "/login" }),
  function(req, res) {
    console.log(req.user)
    // Successful authentication, redirect to myEvents.
    res.redirect("/myEvents");
  });

  server.get("/auth/google",
  passport.authenticate('google', { scope: ["profile"] })
);

server.get("/auth/google/secrets",
  passport.authenticate('google', { failureRedirect: "/login" }),
  function(req, res) {
    console.log(req.user)
    // Successful authentication, redirect to myEvents.
    res.redirect("/myEvents");
  });


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

// temporary routes
server.get('/comingsoon', (req, res) => {
  res.sendFile(__dirname + '/public/comingsoon.html');
})

//index handle
server.get("/", mongooseFunctions.setUpIndex);

// about netup
server.get('/netup', (req, res) => {
  res.render('pages/aboutNetup', {user: userController.isLoggedIn(req.user)});
})

// about our team
server.get('/team', (req, res) => {
  res.render('pages/aboutTeam', {user: userController.isLoggedIn(req.user)});
})

// login handle
server.get("/login", (req, res) => {
  res.render("pages/login", { user: userController.isLoggedIn(req.user) });
});

// signup handle
server.get("/signup", (req, res) => {
  res.render("pages/signup", { user: userController.isLoggedIn(req.user) });
});

// registration (signup) handle
server.post("/signup", mainController.createAccount);

// post handle for create page event
server.post('/create', userController.createEvent);

// create event page
server.get("/create", (req, res) => {
  res.render("pages/createEvent", {
    user: userController.isLoggedIn(req.user),
  });
});

// user account page handle
server.get("/myevents", checkAuth, mongooseFunctions.prepareEvent);

server.get("/deleteEvent/:eventId", mongooseFunctions.deleteEvent);

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

server.post("/create", userController.createEvent);


// 404 page route (Please keep at the very bottom)
server.use(function (req, res, next) {
  res.status(404).sendFile(__dirname + '/public/404.html');
})

