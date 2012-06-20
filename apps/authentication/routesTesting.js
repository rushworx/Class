
var routes;
routes = function(app) {
  app.get('/login', function(req, res) {});
  return res.render("" + __dirname + "/views/login", {
    title: 'Login',
    stylesheet: 'login'
  });
};

app.post('/sessions', function(req, res) {
//Needs to fix the session to mongo instead of redis.

  //this gets one user if it finds it...
  UserModel.findOne({login : req.body.user}, function (err,doc) {
    
    //If it throws an error, it did not find the user in the database
    if (err) {
      req.flash('error', "The username " +req.body.user+ " is incorrect.");
      return res.redirect('/login');
      }
    //If it finds the user, we must verify the password.
    else {
      if (doc.password == req.body.password) {
        req.session.currentUser = req.body.user;
        req.flash('info', "You are now logged in as " + req.session.currentUser + ".");
        res.redirect('/admin/pies');
        return;
        }
      //If the password is wrong, the user gets redirected to the login screen
      else {
        req.flash('error', 'The password was incorrect. Please login again.');
        return res.redirect('/login');
      } 
    }
  });
});

app.del('/sessions', function(req, res) {
  return req.session.regenerate(function(err) {
    req.flash('info', 'You have been logged out.');
    return res.redirect('/login');
  });
});
module.exports = routes;