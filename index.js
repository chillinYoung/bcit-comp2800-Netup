const express = require('express');
const ejsLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const config = require('./config/config');
const mysql = require('mysql');
const findOrCreate = require('mongoose-findorcreate');
const schema = require("./db/mongooseSchema");
const passportLocalMongoose = require("passport-local-mongoose");
require('dotenv').config();
const GitHubStrategy = require('passport-github').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

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

//Define MySQL parameter in Config.js file.
const pool = mysql.createPool({
  host     : config.host,
  user     : config.username,
  password : config.password,
  database : config.database
});

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

server.use(express.static('public'));
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

// Passport session setup.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


passport.use(new FacebookStrategy({
  clientID: "559597601651836",
  clientSecret: "404682cf8b29834311d8d275c8175a29",
  callbackURL: "http://localhost:5050/auth/facebook/callback"
},
function(accessToken, refreshToken, profile, cb) {
  User.findOrCreate({ facebookId: profile.id }, function (err, user) {
    return cb(err, user);
  });
}
));

//For facebook login
server.use(cookieParser());
server.use(session({ secret: 'keyboard cat', key: 'sid'}));

//Github
passport.use(new GitHubStrategy({
  clientID: "bc9876b04ebf2a2a49df",
  clientSecret: "a222cc9a6a23ededf73ee91a42890f99d886cdeb",
  callbackURL: "http://localhost:5050/auth/github/callback"
},
function(accessToken, refreshToken, profile, cb) {
  User.findOrCreate({ githubId: profile.id }, function (err, user) {
    return cb(err, user);
  });
}
));

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

//login via Facebook
// server.get('/auth/facebook', passport.authenticate('facebook',{scope:'email'}));
server.get('/auth/facebook', passport.authenticate('facebook',{scope: ['email', 'user_friends']}));

server.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect : '/myEvents', failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

//login via Github
server.get('/auth/github',
  passport.authenticate('github'));

server.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/myEvents');
  });

// about netup
server.get('/netup', (req, res) => {
  res.render('pages/aboutNetup', {user: userController.isLoggedIn(req.user)});
})

// about our team
server.get('/team', (req, res) => {
  res.render('pages/aboutTeam', {user: userController.isLoggedIn(req.user)});
})

// all events page
server.get('/allevents', mongooseFunctions.setUpAllEvents);
server.get('/allEventsSuccess', (req, res)=> {
  req.flash("success_msg", "Joined Event successfully");
  res.redirect("/allevents")
});

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
server.get("/myEvents", checkAuth, mongooseFunctions.prepareEvent);

server.get("/deleteEvent/:eventId", mongooseFunctions.deleteEvent);
server.get("/leaveEvent/:eventId", mongooseFunctions.leaveEvent);

// signout handle
server.get("/signout", (req, res) => {
  req.logout();
  req.flash("success_msg", "Logged out successfully");
  res.redirect("/");
});

server.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/myEvents",
    failureRedirect: "/login",
    failureFlash: true,
    successFlash: true,
  })(req, res, next);
});

server.post("/create", userController.createEvent);

// contact form will be moved to it's own file later.
server.get('/contact', (req, res) => {
  res.render('pages/contact', { user: userController.isLoggedIn(req.user) });
});

server.post('/send', mongooseFunctions.contactForm);

server.post("/joinEvent", (req, res) => {
  console.log("User id is " + req.user._id);
  console.log("Event id is " + req.body.id);
  schema.Event.updateOne({ _id: req.body.id }, {$push: {participants: req.user.id}},(err, foundEvent) => {
    if (!err) {
      console.log("Successfully updated event!");
    } else {
      res.send(err);
    }
  });
  schema.User.updateOne({ _id: req.user.id }, {$push: {joinedEvents: req.body.id}},(err, foundEvent) => {
    if (!err) {
      console.log("Success")
    } else {
      res.send(err);
    }
  });
  console.log("Take that!!!");
})


// 404 page route (Please keep at the very bottom)
server.use(function (req, res, next) {
  res.status(404).sendFile(__dirname + '/public/404.html');
})

