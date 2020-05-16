//jshint esversion:6
require('dotenv').config();
const express = require("express");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require("mongoose");
require('dotenv').config();
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require('mongoose-findorcreate');

// Connect with mongoose database
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
  eventDate: Date,
  duration: Number,
  description: String,
};

const Event = mongoose.model("Event", eventSchema);

// Schema for mongoDB
// added isEmailVerified to the user schema for email verification
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  interests: [String],
  hostedEvents: [Object],
  joinedEvents: [Object],
  googleId: String,
  githubId: String,
  facebookId: String,
  secret: String
});
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = mongoose.model("User", userSchema);

// Schema for a temporary token for email verification

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

const TempUser = mongoose.model("TempUser", TempUserSchema);

let schemas = { User: User, 
                Event: Event,
                TempUser: TempUser };

module.exports = schemas;
