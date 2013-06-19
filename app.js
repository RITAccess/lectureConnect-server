// LectureConnect Server
// Node and Socket.io server for running backend api for AccessMath
// Author: Michael Timbrook <mpt2360@rit.edu>

// Requires
var manage = require('./ManagementConsole')
  , https = require('https')
  , http = require('http')
  , sio = require('socket.io')
  , fs = require('fs')
  , LectureRuntime = require('./LectureRuntime')
  , lectures = require('./lectures');

// Socket SSL
// var options = {
// 	key : fs.readFileSync('./src/certs/server.key'),
// 	cert : fs.readFileSync('./src/certs/server.crt')
// };

var socketServer = http.createServer();
var io = sio.listen(socketServer);
socketServer.listen(9000);

// Connecting to the database
var mongoose = require('mongoose')
db = require('./db');
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
 	// Connected 	
});

// use lecture schema
var Lecture = mongoose.model('Lecture');

// Storing clients for later access
var clients = {};
exports.clientCount = function() {
	var count = 0;
	for (key in clients) { 
		count++;
	}
	return count;
}

// Setup the server
io.configure('development', function() {
	io.set('log level', 1);
});

// Create connections
io.sockets.on('connection', function(socket) {
	// Add the client to the dictionary
	console.log(socket.id + " connected");
	socket.name = "Unnamed";
	socket.emit('Status',{info : "You have connected to AccessLecture development server."});

	// Get name
	socket.emit('get-name');
	socket.on('set-name', function(data) {
		socket.name = data;
	});

	// Handle dashboard
	socket.on('manage-connect', function(data) {
		// console.log(data);
	});

	// Current Data Query
	socket.on('data-query', function (data) {
		if (data.length < 2) return;
		var cleandata = data.replace(/[^\w\s]/gi,'');
		var re = new RegExp(cleandata, 'i');
		var query = Lecture.find({name : re});
		query.select("name description");
		query.exec(function(err, lecture) {
			if (!err) {
				if (lecture != null) {
					socket.emit('manage-founddata', lecture);
				}
			}
		});
	});

	// Handle lecture request
	socket.on('lecture-request', function(data){
		console.log("Client request: " + data);
		// Lookup object
		var query = Lecture.findOne({name : data});
		query.exec(function(err, lecture) {
			if (!err) {
				if (lecture == null) {
					console.log("Lecture not found");
					socket.emit('lecture-response-failed', {message : "Lecture not found"})
					return;
				}
				console.log(lecture);
				socket.emit('lecture-response', lecture);
			}
		})

	});

	// Handles streaming request
	socket.on('steaming-request', function(data){
		console.log("Client " + socket.id + " requested connection to " + data);
		if (data in lectures) {
			if (socket.id in clients) {
				clients[socket.id].removeClient(socket.id);
			}
			var lect = lectures[data];
			clients[socket.id] = lect;
			lect.addClient(socket.id, socket);
		} else console.log("No lecture active");
	});

	// Handles client disconnection
	socket.on('disconnect', function() {
		if (socket.id in clients && clients[socket.id]) {
			clients[socket.id].removeClient(socket.id);
			delete clients[socket.id];
		}
		console.log(socket.id + " has disconnected");
	});

	// Set up streamer to lecture.
	socket.on('connect-teacher', function(data){
		console.log(data);
		if ( data.name in lectures ) {
			var lecture = lectures[data.name];
			lecture.setStream(socket);	
		} else {
			socket.emit('status', {status : 'error', message : 'No lecture found'});
		}	
	});

});

// Restore last state
Lecture.find().exec(function(err, objs) {
	if (err) console.log(err);
	for(i in objs) {
		if( objs[i].isActive ) {
			var lectureRuntime = new LectureRuntime(objs[i].name, objs[i].description, objs[i]);
			lectures[objs[i].name] = lectureRuntime;
		}
	}
});

