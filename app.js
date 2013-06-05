// LectureConnect Server
// Node and Socket.io server for running backend api for AccessMath
// Author: Michael Timbrook <mpt2360@rit.edu>

// Requires
var io = require('socket.io').listen(9000);
var mongoose = require('mongoose');
var lectures = require('./ManagementConsole');

// Connecting to the database
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  // yay!
});

// Defining Lecture schema
var lectureSchema = new mongoose.Schema({ 
	name: String, 
	date : { type : Number, default : Date.parse(new Date()) / 1000 },
	data : {
		test : String
	}
});
var Lecture = mongoose.model('Lecture', lectureSchema);

// TEST OBJECT
// var test = new Lecture({
// 	name : "Saved Lecture",
// 	date : Date.parse(new Date()) / 1000,
// 	data : {
// 		test: "Hello Class!"
// 	}
// });
// test.save(function(err, obj) {
// 	if(err)
// 		console.log(err);
// });

// Storing clients for later access
var clients = {};

// Setup the server
io.configure('development', function() {
	io.set('log level', 1);
});

// Create connections
io.sockets.on('connection', function(socket) {
	// Add the client to the dictionary
	console.log(socket.id + " connected");
	socket.emit('Status',{info : "You have connected to AccessLecture development server."});

	// Handle lecture request
	socket.on('lecture-request', function(data){
		console.log("Client request: " + data);
		// Lookup object
		var query = Lecture.findOne({name : data});
		query.select("name date data");
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
		}
	});

	// Handles client disconnection
	socket.on('disconnect', function() {
		if (socket.id in clients) {
			clients[socket.id].removeClient(socket.id);
			delete clients[socket.id];
		}
		console.log(socket.id + " has disconnected");
	});
});

