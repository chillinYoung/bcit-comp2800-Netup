//jshint esversion:6
require('dotenv').config();
const express = require("express");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require("mongoose");
require('dotenv').config();
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require('mongoose-findorcreate');

//Instruction for using mongoose and mongoDB from Complete Web Development bootcamp on Udemy.
// Available at https://www.udemy.com/course/the-complete-web-development-bootcamp/.


// Connect with MongoDB Atlas database online.
mongoose.connect(
  "mongodb+srv://james:A_good_1@cluster0-st3n9.mongodb.net/netup",
  { useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true }
);
// mongoose.set("useCreateIndex", true); // this should be removed since all config should be in the connect config

// Schema for events
const eventSchema = {
  image: String,
  eventTopic: String,
  eventName: String,
  hostName: String,
  hostId: String,
  participants: [Object],
  eventDate: String,
  eventTime: String,
  duration: Number,
  description: String,
};

// Create a variable for the events collection in the database.
const Event = mongoose.model("Event", eventSchema);

// Schema for mongoDB
// added isEmailVerified to the user schema for email verification
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  isEmailVerified: Boolean,
  interests: [String],
  hostedEvents: [Object],
  joinedEvents: [Object],
  googleId: String,
  githubId: String,
  facebookId: String,
  secret: String
});
// Enhance the userSchema to have passport functionality attached.
userSchema.plugin(passportLocalMongoose);
// Enhance the userSchema to use a library that creates users with social media login.  Lets us store the id and name of
// people who access our site with gmail, github, or facebook.
userSchema.plugin(findOrCreate);

// Create a variable for the users collection in the mongoDB Atlas database.
const User = mongoose.model("User", userSchema);

// Schema for a temporary token for email verification
/* This schema block of code was adapted from code found here:
* Source: https://codemoto.io/coding/nodejs/email-verification-node-express-mongodb
*/
const TempUserSchema = new mongoose.Schema({
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  token: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    expires: 300
  }
})

/*
* Code block snippet ends here
* Source: https://codemoto.io/coding/nodejs/email-verification-node-express-mongodb
*/

const TempUser = mongoose.model("TempUser", TempUserSchema);

// Export the collections for users, temporary users (for email verification), and events as an object.
let schemas = { User: User, 
                Event: Event,
                TempUser: TempUser };

// Export the collections from this module.
module.exports = schemas;
