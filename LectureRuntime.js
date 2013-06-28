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
	this.stream = null;
	this.screenData = null;
	console.log("New Runtime: " + this.name);
}

LectureRuntime.prototype.addClient = function(client_id, socket) {
	if (!(client_id in this.sittingClients)) {
		this.sittingClients[client_id] = socket;
		this.numberOfClients++;
	}
	var data = this.lecture.data;
	for (var i = 1; i < data.length; i++) { // Still inits with Test Data First
		socket.emit('update', data[i]);
	}
};

LectureRuntime.prototype.removeClient = function(client_id) {
	if (this.sittingClients && client_id in this.sittingClients) {
		delete this.sittingClients[client_id];
		this.numberOfClients--;
	}
};

LectureRuntime.prototype.getClients = function() {
	var clients = [];
	var i = 0;
	for(key in this.sittingClients) {
		clients[i] = this.sittingClients[key];
		i++;
	}
	return clients;
}

LectureRuntime.prototype.setStream = function(socket) {
	var that = this;
	this.stream = socket;
	this.stream.on('disconnect', function(){
		delete that.stream;
	});
	this.start();
	this.stream.emit('status', {status : "ready"});
	this.stream.emit('get-size');
	this.stream.emit('set-cord', function(data){
		that.screenData = data;
		that.updateScreenSize();
	});
};

LectureRuntime.prototype.updateScreenSize = function() {
	var that = this;
	for (_id in this.sittingClients)  {
		var socket = this.sittingClients[_id];
		socket.emit('set-size', that.screenData );
	}
}

LectureRuntime.prototype.getStreamInfo = function() {
	if (this.stream) {
		return this.stream.name;
	} else {
		return null;
	}
}

LectureRuntime.prototype.start = function() {

	var that = this;

	// Push updated from stream
	this.stream.on('update', function(data) {
		// Save data to lecture
		that.lecture.data.push(data);
		that.lecture.save();
		that.sendToClients(data);
	});

};

LectureRuntime.prototype.stop = function() {
	console.log("Stopping " + this.name + "...");
	// Save and clean up lecture data, disconnect clients
	for (_id in this.sittingClients)  {
		var socket = this.sittingClients[_id];
		socket.emit('termination', {
			message: 'Stream is ending',
			status: 'clean'
		});
	}
	// Remove referances
	delete this.sittingClients;
	delete this.numberOfClients;
	delete this.lecture;
	delete this.name;
	console.log("Stopped");
}

// Running loop
LectureRuntime.prototype.sendToClients = function(data) {
	// if (this.numberOfClients > 0)
		// console.log(this.name + " pushing updates to " + this.numberOfClients + " clients");
	for (_id in this.sittingClients) {
		var socket = this.sittingClients[_id];
		socket.emit('update', data);
	}
}

// 'Return' the module
module.exports = LectureRuntime;
