//jshint esversion:6
require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require("mongoose");
require('dotenv').config();
const bodyParser = require("body-parser");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require('mongoose-findorcreate');

// Connect with mongoose database
mongoose.connect(
  "mongodb+srv://james:A_good_1@cluster0-st3n9.mongodb.net/netup",
  { useNewUrlParser: true,
  useUnifiedTopology: true }
);
mongoose.set("useCreateIndex", true);

// Schema for events
const eventSchema = {
  image: String,
  eventTopic: String,
  eventName: String,
  hostName: String,
  hostId: String,
  participants: [String],
  eventDate: Date,
  duration: Number,
  description: String,
};

const Event = mongoose.model("Event", eventSchema);

// Schema for mongoDB
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  interests: [String],
  hostedEvents: [Object],
  joinedEvents: [Object],
  googleId: String,
  secret: String
});
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = mongoose.model("User", userSchema);

let schemas = { User: User, Event: Event };

module.exports = schemas;
