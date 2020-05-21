const nodemailer = require('nodemailer');

// EMAIL VERIFICATION FUNCTIONALITY

module.exports = function(recipient, hash, req, res) {

  let emailBody = `
              
  <h1> Welcome to Netup </h1>

  <p> Please click the link below to verify your email <p>
  <p> It will expire after 5 minutes </p>
  
  <a href="https://dtc10-netup.herokuapp.com/confirmation/${hash}">Verification link here</a> 
  `

  // if you want to use the test accounts instead of actually emailing someone
  // uncomment the host: "smtp.ethereal.email" and the user and pass information
  // under auth and then delete service: 'gmail', and the user and pass information

  // if you want to use google as the mail server, comment out host: "smtp.ethereal.com"
  // and the user details under auth

  const transporter = nodemailer.createTransport({
    // host: "smtp.ethereal.email",
    service: 'gmail',
    port: 587,
    secure: false,
    auth: {
      // user: "estell.will@ethereal.email",
      // pass: "HBEB2ufzXwuH8rttgf"
      user: 'netupTestEmail@gmail.com', 
      pass: 'Netup123@'
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  const mailOPtions = {
    from: "estell.will@ethereal.email",
    to: recipient,
    subject: "testing verification email",
    html: emailBody
  }

  transporter.sendMail(mailOPtions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);   
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    
    req.flash("success_msg", "Please check your email to verify before you can login");
    res.redirect('/login');
  });

}