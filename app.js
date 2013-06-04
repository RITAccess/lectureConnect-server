var io = require('socket.io').listen(9000);
var readline = require('readline');

var clients = {};

// Set up serverside input
var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

// Set up the server
io.configure('development', function() {
	io.set('destroy upgrade', false);
});

io.sockets.on('connection', function(socket) {
	// Add the client to the dictionary
	console.log(socket.id + " connected");
	clients[socket.id] = socket;

	socket.emit('Status',{info : "You have connected to AccessLecture development server."});

	// Handle lecture request
	socket.on('lecture-request', function(data){
		console.log("Client request: " + data);
		currentTime  = new Date();
		socket.emit('lecture-response', {name : "Test Lecture", date : Date.parse(currentTime) / 1000, data : {}});
	});
});

setInterval(function() {
	console.log("Sending update");
	io.sockets.emit('update', "Hello World!");

}, 10000);
