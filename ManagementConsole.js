// LectureConntect Managment Console
// Web frontend controller to communicate with appengine
// Author: Michael Timbrook <mpt2360@rit.edu>

var express = require('express');
var app = express();

app.get('/', function(req, res){
	var response = 'LectureConnect<br />';
	for (key in information) {
		response += key + '<br />';
	}
	res.send(response);
});

app.listen(8080);
