
# References and source for functionality

1. Email Verification Functionality
- implementation concept referenced this [article](https://codemoto.io/coding/nodejs/email-verification-node-express-mongodb)
- I took the code snippet for TempUserSchema from [article](https://codemoto.io/coding/nodejs/email-verification-node-express-mongodb) but they called it TokenSchema which I've already commented inline inside the file mongooseSchema.js
- Read the Nodemailer and passport documentation to implement the rest of the code

2. Passport Local Strategy Authentication
- Referenced Traversy Media' [tutorial](https://www.youtube.com/watch?v=6FOq4cUdH8k) to implement the authentication flow. Please see code inline for snippets that was inspired by Brad Traversy.


## Test Plan
https://docs.google.com/spreadsheets/d/1i10TOo_MbF_NREpyH08IiKmlHsNerO_lF4zTSKJ_mWU/edit#gid=394496370

## Netup Overview

- a platform created to allow anyone to initiate an event that anyone can join online anywhere in the world without worrying about language barriers

## DTC Team 10 Members

- Young Kim
- James Reinhardt
- Antony Pham
- Lily Yang

## Start Guide

### Set up

__Install dependencies__

1. Run the command `npm install`

__Set up google authentication__

1. Create .env file in the main directory
2. JAMES TO UPDATE DETAILS REQUIRE FOR GOOGLE AUTHENTICATION

__Set up MongoDB__
JAMES TO UPDATE

__Set set for 3rd Party API's__
* Twilio
ANTONY TO UPDATE

* OTHERS?

__Start the app__
1. Start the app `npm run dev`
1. Go to http://localhost:5050 to view the app

__Host the app__
- The project is set up to host node.js applications on heroku
- You can update the configuration files and change the host yourselves if you don't want to host on heroku
- If you do choose to host on heroku, you can click [here](https://devcenter.heroku.com/articles/deploying-nodejs) for more instructions

