# COMP2800 Project
- BCIT course for students to work in teams to build web applications

## Start Guide

1. Install dependencies `npm install`
2. Create a .env file in the same directory as index.js and Procfile.
3. Add the two lines for google authentication, shared on slack (ask james).
4. Start the app `npm run dev`
5. Go to http://localhost:5050 to view the app


## DTC Team 10 Members

- Young Kim
- James Reinhardt
- Antony Pham
- Lily Yang

## App Name: Netup

- a platform created to allow anyone to initiate an event that anyone can join online anywhere in the world without worrying about language barriers

## Version

- 1.0.0

## References and source for functionality

1. Email Verification Functionality
- implementation concept referenced this [article](https://codemoto.io/coding/nodejs/email-verification-node-express-mongodb)
- I took the code snippet for TempUserSchema from [article](https://codemoto.io/coding/nodejs/email-verification-node-express-mongodb) but they called it TokenSchema which I've already commented inline inside the file mongooseSchema.js
- Read the Nodemailer and passport documentation to implement the rest of the code

2. Passport Local Strategy Authentication
- Referenced Traversy Media' [tutorial](https://www.youtube.com/watch?v=6FOq4cUdH8k) to implement the authentication flow. Please see code inline for snippets that was inspired by Brad Traversy.