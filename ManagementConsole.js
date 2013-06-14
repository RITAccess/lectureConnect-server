// LectureConntect Managment Console
// Web frontend controller to communicate with appengine
// Author: Michael Timbrook <mpt2360@rit.edu>

var express = require('express')
  , routes = require('./routes')
  , account = require('./routes/account')
  , control = require('./routes/control')
  , http = require('http')
  , path = require('path')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
var app = express();

// Setup auth
passport.use(new LocalStrategy(
	function(username, password, done) {
		console.log("Attempted Login");
		if (username == 'admin' && password == 'admin') {
			console.log("Successful login");
			return done(null, username);
		} else {
			return done(null, false);
		}
	}
));

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(user, done) {
	done(null, user);
});

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({secret: 'hSu6gT9' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.methodOverride());
app.use(function(req, res, next) {
	// Check login
	var pass = req.url.match(/\/stylesheets*|\/javascripts*|\/img*|\/signin/g);
	if (req.user != null || pass ) {
		next();
	} else {
		res.render('signin', {title : 'LectureConnect'});
	}
});
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Routes
app.get('/', routes.index);
app.get('/create', routes.create);
app.get('/signin', routes.signin);
app.post('/signin', passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/signin'
}));
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/signin');
});
app.get('/account', account.index);
app.get('/lecture/:id', routes.lecture);
app.get('/start/:id', control.start);
app.get('/kill/:id', control.destroy);


// Start webserver
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
