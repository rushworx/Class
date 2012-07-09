// Generated by CoffeeScript 1.3.1
(function() {
  var helpers;

  helpers = function(app) {
    app.dynamicHelpers({
      flash: function(req, res) {
        return req.flash();
      },
      userGreeting: function(req, res) {
        return "Howdy, " + req.session.currentUser + "!";
      },
      currentPath: function(req, res) {
        return req.path;
      }
    });
    return app.helpers({
      urlFor: function(obj) {
        if (obj.id) {
          return "/admin/pies/" + obj.id;
        } else {
          return "/admin/pies";
        }
      },
      cssClassForState: function(expected, actual) {
        if (actual === expected) {
          return [expected, 'on'];
        } else {
          return expected;
        }
      },
      cssClassForCurrentURL: function(actual, expected) {
        if (actual === expected) {
          return 'current';
        }
        return null;
      },
      cssClassForPieAge: function(pie) {
        var minutes, pieAge;
        pieAge = (new Date).getTime() - pie.stateUpdatedAt;
        minutes = function(num) {
          return 1000 * 60 * num;
        };
        switch (pie.state) {
          case 'making':
            if (pieAge > minutes(1)) {
              return 'almost-ready';
            } else {
              return 'not-ready';
            }
            break;
          case 'ready':
            if (pieAge < minutes(1)) {
              return 'pipin-hot';
            } else if (pieAge < minutes(2)) {
              return 'hot';
            } else {
              return 'warm';
            }
            break;
          default:
            return null;
        }
      },
      wordsForPieAge: function(pie) {
        var cssClass, message, messages, messagesForPieAge, randomInt;
        messages = {
          'almost-ready': ["almost ready"],
          'not-ready': ["in the makin'", "cookin'", "in da oven"],
          'pipin-hot': ["pipin' hot", "fresh out of the oven"],
          'hot': ["hot", "mmmmm"],
          'warm': ["warm", "toasty"]
        };
        cssClass = this.cssClassForPieAge(pie);
        messagesForPieAge = messages[cssClass];
        randomInt = Math.floor(Math.random() * messagesForPieAge.length);
        message = messagesForPieAge[randomInt];
        return ' is ' + message;
      }
    });
  };

  module.exports = helpers;

}).call(this);
