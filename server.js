require('coffee-script');

/**
 * Module dependencies.
 */

var express = require('express'),
		RedisStore = require('connect-redis')(express);

require('express-namespace');

var app = module.exports = express.createServer();

// Configuration
require('./apps/socket-io')(app);

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
	app.set('port', 3010);
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser());
	app.use(express.session({
		secret: "KioxIqpvdyfMXOHjVkUQmGLwEAtB0SZ9cTuNgaWFJYsbzerCDn",
		store: new RedisStore
	}));
	app.use(require('connect-assets')());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('test', function(){
  app.set('port', 3011);
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Helpers

require('./apps/helpers')(app);

// Routes

require('./apps/authentication/routes')(app)
require('./apps/admin/routes')(app)
require('./apps/sidewalk/routes')(app)
app.listen(app.settings.port);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
