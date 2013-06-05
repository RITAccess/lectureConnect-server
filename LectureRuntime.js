// Lecture Runtime
// Driver for running a lecture on the http.ServerResponse
// Author: Michael Timbrook <mpt2360@rit.edu>

// Create a new runtime
function LectureRuntime(Lname) {
	this.name = Lname;
	this.sittingClients = {};
	this.numberOfClients = 0;
	console.log("New Runtime: " + this.name);
}

LectureRuntime.prototype.addClient = function(client_id, socket) {
	if (!(client_id in this.sittingClients)) {
		this.sittingClients[client_id] = socket;
		this.numberOfClients++;
	}
};

LectureRuntime.prototype.removeClient = function(client_id) {
	if (client_id in this.sittingClients) {
		delete this.sittingClients[client_id];
		this.numberOfClients--;
	}
};

// Start the lecture updating
LectureRuntime.prototype.start = function() {

	// Testing Implementation of updated data...
	setInterval(running, 5000);

};

// Running loop
function running() {
	if (this.numberOfClients > 0)
		console.log(this.name + " pushing updates to " + this.numberOfClients + " clients");
	for (_id in this.sittingClients) {
		var socket = this.sittingClients[_id];
		socket.emit('update',{message : "Test Message"});
	}
}

// 'Return' the module
module.exports = LectureRuntime;