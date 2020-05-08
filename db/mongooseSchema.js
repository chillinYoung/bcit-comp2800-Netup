const mongoose = require("mongoose");

// Connect with mongoose database
mongoose.connect(
  "mongodb+srv://james:A_good_1@cluster0-st3n9.mongodb.net/netup",
  { useNewUrlParser: true,
  useUnifiedTopology: true }
);

// Schema for events
const eventSchema = {
  image: String,
  eventTopic: String,
  eventName: String,
  hostName: String,
  participants: [String],
  eventDate: Date,
  duration: Number,
  description: String,
};

const Event = mongoose.model("Event", eventSchema);

// Schema for mongoDB
const userSchema = {
  name: String,
  email: String,
  password: String,
  interests: [String],
  hostedEvents: [Object],
  joinedEvents: [Object],
};

const User = mongoose.model("User", userSchema);

let schemas = { User: User, Event: Event };

module.exports = schemas;
