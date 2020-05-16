module.exports = {
  ensureAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error', `Please log in to view the ${req.url} page`);
    res.redirect('/login');
  }
}