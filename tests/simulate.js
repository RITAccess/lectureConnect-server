// Simulate streaming from server

var io = require('socket.io-client');

var socket = io.connect('http://localhost:9000');

socket.on('connect', function() {
	console.log('Connected');

	// Connect to Math Class as teacher
	socket.emit('connect-teacher', {
		name : 'Math Class'
	});

	socket.on('status', function(data) {
		if (data.status == 'ready') {

			socket.emit('update',{message : { 
			date : Date.parse(new Date()) / 1000,
			update: {
				x : Math.floor(Math.random()*1024),
				y : Math.floor(Math.random()*760)
			}
		}});


		}
	});	


});