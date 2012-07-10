(function() {
var helpers;
helpers = function(app) {
  return app.dynamicHelpers({
    flash: function(req, res) {
      return req.flash();
    },
         userGreeting: function(req, res) {
        return "User | role: " + req.session.currentUser + " | " + req.session.currentUserRole;
      },
      currentPath: function(req, res) {
        return req.path;
      }
    
  });
};
module.exports = helpers;

}).call(this);