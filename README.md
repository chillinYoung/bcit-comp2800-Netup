<!--lint disable no-literal-urls-->
<p align="center">
  <a href="https://dtc10-netup.herokuapp.com">
    <img
      alt="Netup"
      src="./public/src/assets/images/logo.png"
      width="400"
    />
  </a>
</p>

A platform created to allow anyone to initiate an event that anyone can join online anywhere in the world without worrying about language barriers

# Attribution
This Netup app is made possible because of amazing people that created:

* [Node.js](https://github.com/nodejs/node) for allow us to use Javascript on the server!
* [Express.js](https://github.com/expressjs/express) for allowing us to easily write a server for our application
* [Mongoose](https://github.com/Automattic/mongoose) for allowing us to easily integrate MongoDB with our application
* [Passport](https://github.com/jaredhanson/passport), [passport-github](https://github.com/jaredhanson/passport-github), [passport-google-oauth2](https://github.com/jaredhanson/passport-google-oauth2), [passport-local](https://github.com/jaredhanson/passport-local) for all of our user authentication needs
* [connect-flash](https://github.com/jaredhanson/connect-flash) for enabling flash messaging to work properly with redirects
* [Nodemailer](https://github.com/nodemailer/nodemailer) for enabling us to send emails from our Node application
* [bcrypt](https://github.com/kelektiv/node.bcrypt.js/) for encrpyting passwords in mongoDB
* [shareThis](https://sharethis.com/) for easily sharing our app on social media platforms
* [Heroku](https://devcenter.heroku.com/articles/deploying-nodejs) for allowing us to host our app for free
* [ejs](https://github.com/mde/ejs), [express-ejs-layout](https://github.com/soarez/express-ejs-layouts) which is the templating engine for rendering dynamic pages
* [Twilio](https://github.com/twilio/twilio-video-app-react) for real-time video streaming
* [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for allowing us to have a database for free on the cloud

Thank you for making these resources free so it's possible for us to create applications with ease!

## Additional References and source for functionality

__Email Verification Functionality__
- implementation concept referenced this [article](https://codemoto.io/coding/nodejs/email-verification-node-express-mongodb)
- I took the code snippet for TempUserSchema from [article](https://codemoto.io/coding/nodejs/email-verification-node-express-mongodb) but they called it TokenSchema which I've already commented inline inside the file mongooseSchema.js
- Read the Nodemailer and passport documentation to implement the rest of the code

__User Authentication and DB__
- Referenced Traversy Media' [tutorial](https://www.youtube.com/watch?v=6FOq4cUdH8k) to implement the authentication flow. Please see code inline for snippets that was inspired by Brad Traversy.
- Referenced Angela Yu's course on Udemy, [The Complete Web Development Bootcamp](https://www.udemy.com/course/the-complete-web-development-bootcamp/)

# Team

The team is made up of 4 students in the BCIT Computer Systems Technology Diploma program 

- Young Kim (CST Term 1)
- James Reinhardt (CST Term 2)
- Antony Pham (CST Term 2)
- Lily Yang (CST Term 1)

# Overview

## How our repo is organized

* [config](https://github.com/lilyyanglt/COMP-2800-Team-DTC-10-Netup/tree/master/config) - holds configuration related files
* [controller](https://github.com/lilyyanglt/COMP-2800-Team-DTC-10-Netup/tree/master/controller) - holds the files that can be imported by index.js 
* [model](https://github.com/lilyyanglt/COMP-2800-Team-DTC-10-Netup/tree/master/model) - holds the schema of our db 
* [public](https://github.com/lilyyanglt/COMP-2800-Team-DTC-10-Netup/tree/master/public) - that holds all of the static resources such as assets, images, css, and front-end javascript files
* [views](https://github.com/lilyyanglt/COMP-2800-Team-DTC-10-Netup/tree/master/views) - that holds all of the dynamic pages 
* index.js - which is the main app

## Test Plan
Click [here](https://docs.google.com/spreadsheets/d/1i10TOo_MbF_NREpyH08IiKmlHsNerO_lF4zTSKJ_mWU/edit#gid=394496370) for our test plan

## License
[MIT](https://github.com/lilyyanglt/COMP-2800-Team-DTC-10-Netup/blob/master/LICENSE)

# Start Guide

1. __Install dependencies__

    * Run the command `npm install`

2. __Set up google authentication__

    1. Create .env file in the main directory
    2. Add credentials to the .env file for google authentication.  
      - When you create a new google project in your google developer console, you will find a client id and client secret in the credentials section of the api dashboard.  Enter them in your .env file with no spaces, like below.

      ```
        CLIENT_ID=<"PUT YOUR CLIENT ID HERE>
        CLIENT_SECRET=<"PUT YOUR CLIENT SECRET HERE">
      ```

      For more complete instructions see the [passport js documentation on Google OAuth 2.0.](http://www.passportjs.org/packages/passport-google-oauth20/)

3. __Set up Github authentication__

    1. Click on your profile picture in the upper right-hand corner to open account drop-down menu.
    2. Go to settings.
    3. Click on developer settings at the bottom of the navigation bar to the left.
    4. Select oauth apps and click on 'New Oauth App'.
    5. Choose an application name and enter 'http:localhost:5050' into the Hompage URL input.
    6. Enter http:localhost:5050/auth/github/callback into the Authorization callback URL input.
    7. Select 'Register application' to get your Client ID and client secret.
    8. Add your client id and client secret to your .env file like below.


      ```
        GITHUBID=<PUT YOUR GITHUB CLIENT ID HERE>
        GITHUBSECRET=<"PUT YOUR Github CLIENT SECRET HERE">
      ```
    9. Now you will be able to use Github to sign in to the account.


4. __Set up MongoDB__

    1.  First you will need to set up an account with mongoDB atlas and create a cluster.  
    For more imformation on setting up a cluster with MongoDB, see this [helpful guide.](https://intercom.help/mongodb-atlas/en/articles/3013643-creating-databases-and-collections-for-atlas-clusters)

    2. Add your mongoDB atlas connection string URL to the .env file as well on its own line with no spaces.

    ```
    MONGODB_CLIENT=<"PUT YOUR MONGODB CONNECTION STRING HERE">
    ```

    The connection string should look like this:
    ```
        mongodb+srv://<username>:<password>@<cluster_id>/<Any name you choose for your database>
    ```

5. __Set up Twilio for video streaming__
    * Twilio
    
    1. Go to https://github.com/twilio/twilio-video-app-react 
    2. Clone the repository in master branch
    3. Open the repository on Visual Studio Code
    4. Run "npm install" to install all dependencies from NPM
    5. Install twilio-cli with: $ npm install -g twilio-cli
    6. Login to the Twilio CLI: $ twilio login
    7. Install the CLI plugin with: $ twilio plugins:install @twilio-labs/plugin-rtc
    8. Deploy twilio with: $ npm run deploy:twilio-cli. It wil generate a link used to access the Video app
    9. The link will expire in 1 week. To generate a new link, redeploy the app: $ npm run deploy:twilio-cli -- --override
    10. Once you have the link, you will need to replace the twilio link inside `./views/pages/myEvents.ejs`, there should be one line of code in line 2 that you need to update.

    ```html
      <!-- You Can Change Twilio Link Below -->
      <% let twilioLink = "YOUR TWILIO LINK HERE" %>

    ```

6. __Start the app__
    1. Start the app `npm run dev`
    1. Go to http://localhost:5050 to view the app

7. __Host the app__ (Optional)
    - The project is set up to host node.js applications on heroku
    - You can update the configuration files and change the host yourselves if you don't want to host on heroku
    - If you do choose to host on heroku, you can click [here](https://devcenter.heroku.com/articles/deploying-nodejs) for more instructions

