require('coffee-script');

/**
 * Module dependencies.
 */

var express = require('express'),

  RedisStore = require('connect-redis')(express);

require('express-namespace')

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('port', 3004);
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({
    secret: "afldsjfsafsafsafsdfsdfwwfaw",
    store: new RedisStore
  
  }));
  app.use(require('connect-assets')());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});
// helpers
require('./apps/helpers')(app);
// Routes
require('./apps/authentication/routes')(app)
require('./apps/dash/routes')(app)


app.listen(app.settings.port, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

