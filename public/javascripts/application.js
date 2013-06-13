var socket;

$(document).ready(function(){

	// Set up
	setupSocket();

	// Set up search                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
	var searchdata = $('.search-box').typeahead({
		source : searchServer
	});

	$('.search-box').keypress(function(e){
		if(e.which == 13) {
			console.log("enter");
		}
	});


});

// Set up websocket connection back to server

function setupSocket () {
	console.log("Setting up connection to "+document.location.hostname + ":9000...");

	socket = io.connect(document.location.hostname + ":9000")
	socket.on('connect', function(data) {
		console.log("Connected.");
		socket.emit('manage-connect', {request : 'connection'})
	});

	socket.on('Status', function(data) {
		console.log(data.info);
	})
	socket.on('manage-info', onMessage);
}

function onMessage(data) {
	console.log(data);
}

function searchServer (query, process) {
	socket.emit('data-query', query);
	socket.on('manage-founddata', function(data){
		// var newData = [];
		// for (var i = 0; i < data.length; i++) {
		// 	var tmp = data[i].name;
		// 	Object.defineProperty(tmp, '_id', data._id);
		// 	newData[i] = tmp;
		// }
		process(data);
	});

}