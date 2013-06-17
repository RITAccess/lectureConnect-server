// Simulate streaming from server

var io = require('socket.io-client');
var os = require('os');
var socket = io.connect('http://localhost:9000');

socket.on('connect', function() {
	console.log('Connected');

	// Connect to Math Class as teacher
	socket.emit('connect-teacher', {
		name : 'Math Class'
	});

	// Respond to get-name
	socket.on('get-name', function() {
		socket.emit('set-name', os.hostname());
	});

	socket.on('status', function(data) {
		if (data.status == 'ready') {
			for (var i = 0; i < 20; i ++) {
				socket.emit('update',{
					message : { 
						date : Date.parse(new Date()) / 1000,
						update: {
/* This is where */			x : Math.floor(Math.random()*1024),
/* I start to hate */		y : Math.floor(Math.random()*760)
/* Brackets */			}
					}
				});
			}
		}
		if (data.status == 'error') {
			console.log(data.message);
		}
	});
});
