// Generated by CoffeeScript 1.3.1
(function() {
  var Pie, routes, _;

  Pie = require('../../models/pie');

  _ = require('underscore');

  routes = function(app) {
    return app.namespace('/admin', function() {
      app.all('/*', function(req, res, next) {
        if (!req.session.currentUser) {
          req.flash('error', 'Please login.');
          res.redirect('/login');
          return;
        }
        return next();
      });
      app.get('/', function(req, res) {
        return res.redirect('/admin/menu/stage');
      });
      app.namespace('/pies', function() {
        app.get('/', function(req, res) {
          var pie;
          pie = new Pie({});
          return Pie.all(function(err, pies) {
            return res.render("" + __dirname + "/views/pies/all", {
              title: 'View All Pies',
              stylesheet: 'admin',
              pie: pie,
              pies: pies
            });
          });
        });
        app.post('/', function(req, res) {
          var attributes, pie;
          attributes = {
            name: req.body.name,
            type: req.body.type
          };
          pie = new Pie(attributes);
          return pie.save(function() {
            req.flash('info', "Pie '" + pie.name + "' was saved.");
            return res.redirect('/admin/pies');
          });
        });
        return app.put('/:id', function(req, res) {
          return Pie.getById(req.params.id, function(err, pie) {
            if (_.include(Pie.states, req.body.state)) {
              return pie[req.body.state](function() {
                var socketIO;
                if (socketIO = app.settings.socketIO) {
                  socketIO.sockets.emit("pie:changed", pie);
                }
                return res.send("/admin/pies/" + req.params.id);
              });
            } else {
              return res.render('error', {
                status: 403,
                message: "Incorrect Pie state: " + req.body.state + " is not a recognized state.",
                title: "Incorrect Pie state",
                stylesheet: 'admin'
              });
            }
          });
        });
      });
      return app.namespace('/menu', function() {
        return app.get('/stage', function(req, res) {
          return Pie.all(function(err, pies) {
            return res.render("" + __dirname + "/views/menu/stage", {
              title: 'Pie Status',
              stylesheet: 'admin',
              pies: pies
            });
          });
        });
      });
    });
  };

  module.exports = routes;

}).call(this);
