
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
2. Add credentials to the .env file for google authentication.  
  -When you create a new google project in your google developer console, you will find a client id and client secret in the credentials section of the api dashboard.  Enter them in your .env file with no spaces, like below.

```
  CLIENT_ID=<"PUT YOUR CLIENT ID HERE>
     CLIENT_SECRET=<"PUT YOUR CLIENT SECRET HERE">
```

For more complete instructions see the [passport js documentation on Google OAuth 2.0.](http://www.passportjs.org/packages/passport-google-oauth20/)

__Set up MongoDB__

1.  First you will need to set up an account with mongoDB atlas and create a cluster.  
For more imformation on setting up a cluster with MongoDB, see this [helpful guide.](https://intercom.help/mongodb-atlas/en/articles/3013643-creating-databases-and-collections-for-atlas-clusters)

2. Add your mongoDB atlas connection string URL to the .env file as weill on its own line with no spaces.

```
 MONGODB_CLIENT=<"PUT YOUR MONGODB CONNECTION STRING HERE">
```

The connection string should look like this:
```
    mongodb+srv://<username>:<password>@<cluster_id>/<Any name you choose for your database>
```



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

