// Lecture Runtime
// Driver for running a lecture on the http.ServerResponse
// Author: Michael Timbrook <mpt2360@rit.edu>


var sittingClients;

// Create a new runtime
function LectureRuntime(name) {
	this.name = name;
	sittingClients = {};
	console.log("New Runtime: " + this.name);
}

LectureRuntime.prototype.addClient = function(client_id, socket) {
	if (client_id in sittingClients) {
		console.log("Client is already in this session");
	} else {
		sittingClients[client_id] = socket;
	}
};

// Start the lecture updating
LectureRuntime.prototype.start = function() {

	// Testing Implementation of updated data...
	setInterval(running, 5000);

};

// Running loop
function running() {
	for (_id in sittingClients) {
		var socket = sittingClients[_id];
		socket.emit('update',{message : "Test Message"});
		console.log("Message to client " + _id);
	}
}


// 'Return' the module
module.exports = LectureRuntime;