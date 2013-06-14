// Lecture Runtime
// Driver for running a lecture on the http.ServerResponse
// Author: Michael Timbrook <mpt2360@rit.edu>

// Create a new runtime
function LectureRuntime(Lname, desc, lecture) {
	this.name = Lname;
	this.description = desc;
	this.sittingClients = {};
	this.numberOfClients = 0;
	this.lecture = lecture;
	console.log("New Runtime: " + this.name);
}

LectureRuntime.prototype.addClient = function(client_id, socket) {
	if (!(client_id in this.sittingClients)) {
		this.sittingClients[client_id] = socket;
		this.numberOfClients++;
	}
};

LectureRuntime.prototype.removeClient = function(client_id) {
	if (this.sittingClients && client_id in this.sittingClients) {
		delete this.sittingClients[client_id];
		this.numberOfClients--;
	}
};

// Start the lecture updating
LectureRuntime.prototype.start = function() {

	// Testing Implementation of updated data...
	setInterval(running.bind(this), 5000);

};

LectureRuntime.prototype.stop = function() {
	console.log("Stopping " + this.name + "...");
	// Save and clean up lecture data, disconnect clients
	delete this.sittingClients;
	delete this.numberOfClients;
	delete this.lecture;
	delete this.name;
	console.log("Stopped");
}

// Running loop
function running() {
	if (this.numberOfClients > 0)
		console.log(this.name + " pushing updates to " + this.numberOfClients + " clients");
	for (_id in this.sittingClients) {
		var socket = this.sittingClients[_id];
		socket.emit('update',{message : this.lecture.data});
	}
}

// 'Return' the module
module.exports = LectureRuntime;
