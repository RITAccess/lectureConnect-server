var io = require('socket.io').listen(9000);

io.configure('development', function() {
	io.set('destroy upgrade', false);
});

io.sockets.on('connection', function(socket) {
	socket.emit('Status',{info : "You have connected to AccessLecture development server."});

	socket.on('lecture-request', function(data){
		console.log(data);
		socket.emit('lecture-response', {name : "Test Lecture", date : Date.now(), data : {}});
	});
});