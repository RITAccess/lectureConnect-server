// LectureConntect Managment Console
// Web frontend controller to communicate with appengine
// Author: Michael Timbrook <mpt2360@rit.edu>

var express = require('express');
var app = express();
var lectures = {}

app.get('/', function(req, res){
	var response = 'LectureConnect<br />';
	for (key in lectures) {
		lecture = lectures[key]
		response += key + ' has ' + lecture.numberOfClients + ' clients<br />';
	}
	res.send(response);
});

app.listen(8080);

module.exports = lectures;