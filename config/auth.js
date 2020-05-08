module.exports = {
  ensureAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }

    // TO DO IF WE NEED TO
    // include this if we want to include flash messages when user tries to access a restricted page
    // req.flash('error_msg', "Please log in to view this page");
    
    // TEMPORARILY SENDING USER TO MESSAGE
    res.send('Please login to view this page');
  }
}