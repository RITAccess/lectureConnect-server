// LectureConntect Managment Console
// Web frontend controller to communicate with appengine
// Author: Michael Timbrook <mpt2360@rit.edu>

var express = require('express')
  , routes = require('./routes')
  , account = require('./routes/account')
  , control = require('./routes/control')
  , https = require('https')
  , http = require('http')
  , path = require('path')
  , crypto = require('crypto')
  , fs = require('fs')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , mongoose = require('mongoose')
  , db = require('./db');
var app = express();

// Setup auth
passport.use(new LocalStrategy(
	function(username, password, done) {
		var User = mongoose.model('Users');
		User.findOne({ account : username }).exec(function(err, obj) {
			if (err) console.log("Error");
			if (obj == null) {
				done(null, null);
			} else {
				// Begin check
				var sha512 = crypto.createHash('sha512');
				sha512.update(password);
				var hash = sha512.digest('hex');
				if (obj.passhash == hash) {
					console.log("Logged in " + obj.name);
					done(null, obj.name);
				} else {
					done(null, null);
				}
			}
		});
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
// Check auth
app.use(function(req, res, next) {
	// Check login
	var pass = req.url.match(/\/stylesheets*|\/javascripts*|\/img*|\/signin/g);
	if (req.user != null || pass ) {
		next(); // Allow static past (for development)
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
app.post('/account/changepassword', account.changepassword);
app.get('/lecture/:id', routes.lecture);
app.get('/start/:id', control.start);
app.get('/kill/:id', control.destroy);

// Setup SSL
// var options = {
// 	key : fs.readFileSync('./src/certs/server.key'),
// 	cert : fs.readFileSync('./src/certs/server.crt')
// };

// Start webserver
var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

module.exports = server;
