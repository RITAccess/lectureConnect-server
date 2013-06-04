// Requires
var io = require('socket.io').listen(9000);

// Storing clients for later access
var clients = {};

// Setup the server
io.configure('development', function() {
	io.set('log level', 1);
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

	// Handles client disconnection
	socket.on('disconnect', function() {
		console.log(socket.id + " has disconnected");
	});
});

setInterval(function() {
	console.log("Sending update");
	for (key in clients) {
		clients[key].emit('update', "Test");
	}
}, 10000);
