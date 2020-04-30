
// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

const functions = require('firebase-functions');
const express = require('express');
const ejsLayouts = require('express-ejs-layouts');
const admin = require("firebase-admin");

// Firebase initializer
const firebaseApp = admin.initializeApp(functions.config().firebase);

// Initialize DB
// const db = firebaseApp.firestore;

// instantiate express app
const server = express();

// ejs middleware
server.use(ejsLayouts);
server.set('views', './views');
server.set('view engine', 'ejs');

// landing page handle
server.get('/', (req, res) => {
  res.render('index');
})

// login handle
server.get('/login', (req, res) => {
  res.render('login');
})

// signup handle
server.get('/signup', (req, res) => {
  res.render('signup');
})

server

exports.app = functions.https.onRequest(server);
