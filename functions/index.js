
// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

const functions = require('firebase-functions');
const express = require('express');
const ejsLayouts = require('express-ejs-layouts');
const admin = require("firebase-admin");
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

// initialize our mock database
let db = require("./db/mockDatabase");

// Firebase initializer
const firebaseApp = admin.initializeApp(functions.config().firebase);

// instantiate express app
const server = express();

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

// landing page handle
server.get('/', (req, res) => {
  const events = db.events;
  res.render('index', {events: events});
})

// login handle
server.get('/login', (req, res) => {
  res.render('login');
})

// signup handle
server.get('/signup', (req, res) => {
  res.render('signup');
})

server.post('/signup', (req, res) => {
  console.log(req.body);
  res.send("succesfully registered");
})

server.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/accountPage',
    failureRedirect: '/login',
    failureFlash: true,
    successFlash: true
  })(req, res, next);
})

exports.app = functions.https.onRequest(server);
