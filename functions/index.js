// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

const functions = require('firebase-functions');
const express = require('express');
const ejsLayouts = require('express-ejs-layouts');
const admin = require("firebase-admin");
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const config = require('./config/config');
const mysql = require('mysql');

// importing custom modules
const checkAuth = require('./config/auth').ensureAuthenticated;
const userController = require('./controller/userRoute');
const mainController = require('./controller/mainRoute');

// initialize our mock database
let db = require("./db/mockDatabase");

// Firebase initializer
const firebaseApp = admin.initializeApp(functions.config().firebase);

// instantiate express app
const server = express();

//Define MySQL parameter in Config.js file.
const pool = mysql.createPool({
  host     : config.host,
  user     : config.username,
  password : config.password,
  database : config.database
});

// Passport session setup.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

//Configuring passport for OAuth authentication
passport.use(new FacebookStrategy({
  clientID: config.facebook_api_key,
  clientSecret:config.facebook_api_secret ,
  callbackURL: config.callback_url
},
function(accessToken, refreshToken, profile, done) {
  process.nextTick(function () {
    //Check whether the User exists or not using profile.id
    if(config.use_database) {
      // if sets to true
      pool.query("SELECT * from user_info where user_id="+profile.id, (err,rows) => {
        if(err) throw err;
        if(rows && rows.length === 0) {
            console.log("There is no such user, adding now");
            pool.query("INSERT into user_info(user_id,user_name) VALUES('"+profile.id+"','"+profile.username+"')");
        } else {
            console.log("User already exists in database");
        }
      });
    }
    return done(null, profile);
  });
}
));
//For facebook login
server.use(cookieParser());
server.use(session({ secret: 'keyboard cat', key: 'sid'}));


// ejs middleware
server.use(ejsLayouts);
server.set('views', './views');
server.set('view engine', 'ejs');

// PASSPORT CONFIGURATION - FOR AUTHENTICATION
require('./config/passport_local')(passport);

// EXPRESS-SESSION MIDDLEWARE ***********************************************************
// it's a dependency for both passport and connect-flash messaging

server.set('trust proxy', 1) // trust first proxy
server.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
}))

// PASSPORT MIDDLEWARE *******************************************************************
// dependent on express session so must put this middleware after express-session
server.use(passport.initialize());
server.use(passport.session());

// REGISTRATION AND LOGIN ****************************************************************
// this is used to parse form information so that we can see POST requests in json format
// body parser

server.use(express.static('public'));
server.use(express.json());
server.use(express.urlencoded({extended: false}));


// CONNECT-FLASH MIDDLEWARE **************************************************************
server.use(flash());

// CUSTOM MIDDLEWARE *********************************************************************

server.use((req, res, next) => {
  // THIS IS FOR THE CREATE ACCOUNT MESSAGES

  res.locals.success_msg = req.flash('success_msg');
  // this is for the create account page error messages
  res.locals.error_msg = req.flash('error_msg');

  // THIS IS FOR THE AUTHENTICATION ERROR / SUCCESS MESSAGES FROM PASSPORT
  // global variable for the flash error for passport just returns an error
  res.locals.error = req.flash('error');
  // global variable for the flash error for passport when login succeeded
  res.locals.success = req.flash('success');

  next();
})

// INDEX ROUTING - NON USER RELATED
// landing page handle
// TODO: NEED UPDATE WHEN ACTUAL DB IS READY
server.get('/auth/facebook', passport.authenticate('facebook',{scope:'email'}));

server.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect : '/myevents', failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

server.get('/', (req, res) => {
  console.log(req.user);
  console.log(db);
  const events = db.events;
  res.render('pages/index', {
    events: events,
    user: userController.isLoggedIn(req.user)
  });
})

// login handle
server.get('/login', (req, res) => {
  res.render('pages/login', {user: userController.isLoggedIn(req.user)});
})

// signup handle
server.get('/signup', (req, res) => {
  res.render('pages/signup', {user: userController.isLoggedIn(req.user)});
})

// registration (signup) handle
// TODO: NEED TO UPDATE WHEN ACTUAL DB IS READY
server.post('/signup', mainController.createAccount);

// create event page
server.get('/create', (req, res) => {
  res.render('pages/createEvent', {user: userController.isLoggedIn(req.user)});
})

// post handle for create page event
server.post('/create', userController.createEvent);

// user account page handle
server.get('/myevents', ensureAuthenticated, (req, res) => {
  res.render('pages/myevents', {user: userController.isLoggedIn(req.user)});
})

// signout handle
server.get('/signout', (req, res) => {
  req.logout();
  req.flash('success_msg', "Logged out successfully");
  res.redirect('/');
})

server.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/myevents',
    failureRedirect: '/login',
    failureFlash: true,
    successFlash: true
  })(req, res, next);
})

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

exports.app = functions.https.onRequest(server);
