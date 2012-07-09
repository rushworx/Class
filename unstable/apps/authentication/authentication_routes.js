/*
(function() {
  var routes;

  routes = function(app) {
    app.get('/login', function(req, res) {
      return res.render("" + __dirname + "/views/login", {
        title: 'Login',
        stylesheet: 'login'
      });
    });
    app.post('/sessions', function(req, res) {
      if (('piechef' === req.body.user) && ('12345' === req.body.password)) {
        req.session.currentUser = req.body.user;
        req.flash('info', "You are now logged in as " + req.session.currentUser + ".");
        res.redirect('/admin/menu/stage');
        return;
      }
      req.flash('error', 'Those credentials were incorrect. Please login again.');
      return res.redirect('/login');
    });
    return app.del('/sessions', function(req, res) {
      return req.session.regenerate(function(err) {
        req.flash('info', 'You have been logged out.');
        return res.redirect('/login');
      });
    });
  };

  module.exports = routes;

}).call(this);
*/

(function() {
  var routes;

  var mongoose = require('mongoose'); // include mongoose package
  var connection = mongoose.createConnection('mongodb://localhost/newpla2');    //creates the mongo connection   

  //initializzes an empty schema object
  var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;
  
  //populates the schema object with properties  
  var User = new Schema({
    login     : String, // username
    password  : String, // pass
    role      : String  // user's role in a class
  });
  
  
  var UserModel = connection.model('users', User); //UserModel: object sets itself to work w users collection & the above user schema 
  
  var user = new UserModel(); //this creates a new empty user model
  //                user.login = 'ryan';
  //                user.password = 'ryan$1234';
  //this saves the new user
  //                user.save(); 
  
  
  UserModel.findOne({login : 'ryan'}, function (err,doc) { //this gets one user i.e. keith
          console.log(doc);
  });


  var makeNewUser = function(login, pass, role) { //creates a new user...
  //this creates a new empty user model
    var newUser = new UserModel();
    newUser.login = login;
    newUser.password = pass;
    newUser.role = role;
    newUser.save();	
  }
  
  var deleteUser = function(_id) {
    // maybe later.  I don't know mongo+mongoose yet
    UserModel.find({ id:_id });
  }

  // --- Dev Tools ---
  //makeNewUser("piechef", "12345", "lurker"); // try out makeNewUser
  //deleteUser('4ff6182ede6ff31e72000002');

  routes = function(app) {  //what does this do
    app.get('/login', function(req, res) {
      return res.render("" + __dirname + "/views/login", {
        title: 'Login',
        stylesheet: 'login'
      });
    });
    
    
    app.post('/sessions', function(req, res) {
      
      
      UserModel.findOne({login : req.body.user}, function (err,doc) { //this gets one user if it finds it...
    
      
      if (err) { //If it throws an error, it did not find the user in the database
        req.flash('error', "The username " +req.body.user+ " is incorrect.");
        return res.redirect('/login');
       }
      
      else { //If it finds the user, we must verify the password.
        if (doc.password === req.body.password) {
          req.session.currentUser = req.body.user;
          req.session.currentUserRole = doc.role;   // added user role -cm
        //req.session.currentUser.role    isnt working...
          req.flash('info', "You are now logged in as " + req.session.currentUser + ".");
          res.redirect('/admin/pies');
          return;
          }
        
        else { //If the password is wrong, the user gets redirected to the login screen
          req.flash('error', 'The password was incorrect. Please login again.');
          return res.redirect('/login');
         } 
       }
      });      
    });
        
    return app.del('/sessions', function(req, res) {
      return req.session.regenerate(function(err) {
        req.flash('info', 'You have been logged out.');
        return res.redirect('/login');
      });
    });
  };


  module.exports = routes;

}).call(this);
