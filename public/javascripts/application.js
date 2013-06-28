var socket;

$(document).ready(function(){

	// Set up
	setupSocket();

	// Set up search                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
	$('.search-box').typeahead({
		source : searchServer
	});

	$('.search-box').keypress(function(e){
		if(e.which == 13 && $('#lecture-id').val() != '') {
			window.location = '/lecture/' + $('#lecture-id').val() + "?name=" + this.value;
		}
	});

	$('#clearData').click(function(){
		window.location = '/clear/' + $('#clearData').attr('meta');
	});

	// Search shortcut
	$('html').keypress(function(e) {
		switch(e.which) {
			case 47:
				e.preventDefault();
				$('.search-box').focus();
				break;
		}
	})

});

// Set up websocket connection back to server

function setupSocket () {
	console.log("Setting up connection to "+document.location.hostname + ':9000');

	// socket = io.connect(document.location.hostname + ':9000', {secure : true});

	var host = document.location.hostname + ':9000';
	host = 'http://' + host;

	socket = io.connect(host);
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
		process(data);
	});

}


