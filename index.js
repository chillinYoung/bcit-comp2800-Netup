const express = require('express');
const ejsLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const schema = require("./db/mongooseSchema");
require('dotenv').config();
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github').Strategy;


// instantiate express app
const server = express();

// Address for server to run on our local machines that does not conflict with heroku when deploying our site.
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

// EJS MIDDLEWARE **********************************************************************
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
// added key: sid in case James/Antony needs it
server.set("trust proxy", 1); // trust first proxy
server.use(
  session({
    secret: "keyboard cat",
    key: "sid",
    resave: true,
    saveUninitialized: true,
  })
);


// PASSPORT MIDDLEWARE *******************************************************************
// dependent on express session so must put this middleware after express-session
server.use(passport.initialize());
server.use(passport.session());
const User = schema.User


//Instruction for social media login from Complete Web Development bootcamp on Udemy.
// Available at https://www.udemy.com/course/the-complete-web-development-bootcamp/.


// Passport connection to google credentials
passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: "https://dtc10-netup.herokuapp.com/auth/google/secrets",
  userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
},
function(accessToken, refreshToken, profile, cb) {
  console.log(profile);

  // Creates a user in the database for the logged-in gmail account.
  User.findOrCreate({ googleId: profile.id, name: profile.displayName }, function (err, user) {
    return cb(err, user);
  });
}
));

// Google authemtication route for logging in with google.
server.get("/auth/google",
  passport.authenticate('google', { scope: ["profile"] })
);

// Callback route for what to do after logging in with google.
server.get("/auth/google/secrets",
  passport.authenticate('google', { failureRedirect: "/login" }),
  function(req, res) {
    console.log(req.user)
    // Successful authentication, redirect to myEvents.
    res.redirect("/myEvents");
  });

  // Setting up passport configuration for using github.
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUBID,
    clientSecret: process.env.GITHUBSECRET,
    callbackURL: "http://dtc10-netup.herokuapp.com/auth/github/callback"
  },
    // Creating a new user in the database for this github account.
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ githubId: profile.id, name: profile.displayName }, function (err, user) {
      return cb(err, user);
    });
  }
  ));

  //login via Github
server.get('/auth/github',
passport.authenticate('github'));

server.get('/auth/github/callback', 
passport.authenticate('github', { successRedirect : '/myEvents', failureRedirect: '/login' }),
function(req, res) {
  // Successful authentication, redirect home.
  res.redirect('/myevents');
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
/* A portion of this middleware was taken from Brad Traversy
* Source: https://github.com/bradtraversy/node_passport_login/blob/master/app.js
*/
server.use((req, res, next) => {
  // THIS IS FOR THE CREATE ACCOUNT MESSAGES

  res.locals.success_msg = req.flash("success_msg");
  // this is for the create account page error messages
  res.locals.error_msg = req.flash("error_msg");
  // THIS IS FOR THE AUTHENTICATION ERROR / SUCCESS MESSAGES FROM PASSPORT
  // global variable for the flash error for passport just returns an error
  res.locals.error = req.flash("error");

/* Portion of code from Brad Traversy ends here
* Source: https://github.com/bradtraversy/node_passport_login/blob/master/app.js
*/
  // global variable for the flash error for passport when login succeeded
  res.locals.success = req.flash("success");

  res.locals.user = userController.isLoggedIn(req.user);

  next();
});

// Passport session setup.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


// temporary routes
server.get('/comingsoon', (req, res) => {
  res.sendFile(__dirname + '/public/comingsoon.html');
})

//index handle
server.get("/", mongooseFunctions.setUpIndex);


// about netup
server.get('/netup', (req, res) => {
  res.render('pages/aboutNetup');
})

// about our team
server.get('/team', (req, res) => {
  res.render('pages/aboutTeam');
})

// all events page
server.get('/allevents', mongooseFunctions.getAllEvents);
server.get('/allEventsSuccess', (req, res)=> {
  req.flash("success_msg", "Joined Event successfully");
  res.redirect("/allevents")
});

// handle for filtering for specific events
server.get('/allevents/:topic', mongooseFunctions.getEventByTopics);

// event details page for specific event
server.get('/eventdetails/:eventId', mongooseFunctions.getEvent);

// event host page for specific event
server.get('/host/:eventId', mongooseFunctions.getEvent);


// UPDATED LOGIN HANDLE FOR EMAIL VERIFICATION *******************************
// login handle
server.get("/login", (req, res) => {
  res.render("pages/login");
});

server.post("/login", userController.loginPost);

// route for when user clicks the link in the email to verify their email
server.get("/confirmation/:hash", userController.confirmation);

// route for when verification email expired and user needs to have it resend to them

server.get("/resend", (req, res) => {
  res.render('pages/resend');
})

server.post("/resend", userController.resend);
// ***************************************************************************

// Route for redirecting users to login screen when they try to join event without being signed in.
server.get("/loginRequired", (req, res) => {
  req.flash("error", "Users must login first");
  res.redirect("/login")
})

// UPDATED SIGNUP/REGISTRATION HANDLE FOR EMAIL VERIFICATION ******************

// signup handle
server.get("/signup", (req, res) => {
  res.render("pages/signup");
});

// registration (signup) handle
server.post("/signup", mainController.createAccount);

// **************************************************************************
// post handle for create page event
server.post('/create', userController.createEvent);

// create event page
server.get("/create", (req, res) => {
  res.render("pages/createEvent", {
    user: userController.isLoggedIn(req.user),
  });
});

// event details page for specific event
server.get('/eventedit/:eventId', mongooseFunctions.editEvent);
server.post('/update/:eventId', mongooseFunctions.updateEvent)

// user account page handle
server.get("/myEvents", checkAuth, mongooseFunctions.prepareEvent);

server.get("/myfriends", checkAuth);

// Route for deleting a specific event
server.get("/deleteEvent/:eventId", mongooseFunctions.deleteEvent);

// Route for leaving a specific event.
server.get("/leaveEvent/:eventId", mongooseFunctions.leaveEvent);

// signout handle
server.get("/signout", (req, res) => {
  req.logout();
  req.flash("success_msg", "Logged out successfully");
  res.redirect("/");
});

// duplicated codes: it is on line 283 as well
// server.post("/create", userController.createEvent);

// contact form will be moved to it's own file later.
server.get('/contact', (req, res) => {
  res.render('pages/contact');
});

// Route for sending feedback via the contact form.
server.post('/send', mongooseFunctions.contactForm);

// Route for joining an event.
server.post("/joinEvent", mongooseFunctions.joinEvent)


// 404 page route (Please keep at the very bottom)
server.use(function (req, res, next) {
  res.status(404).sendFile(__dirname + '/public/404.html');
})

