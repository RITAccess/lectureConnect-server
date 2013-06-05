// LectureConntect Managment Console
// Web frontend controller to communicate with appengine
// Author: Michael Timbrook <mpt2360@rit.edu>

var express = require('express');
var app = express();
var runtime = require('./LectureRuntime');
var lectures = {}

app.get('/', function(req, res){
	var response = 'LectureConnect<br />';
	for (key in lectures) {
		lecture = lectures[key]
		response += key + ' has ' + lecture.numberOfClients + ' clients<br />';
	}
	res.send(response);
});

app.get('/create/:id', function(req, res) {
	console.log(req.params.id);
	createLecture(req.params.id);
	res.redirect('/');
});

function createLecture(lectureName) {
	var TestLecture = new runtime(lectureName);
	lectures[lectureName] = TestLecture;
	TestLecture.start();
}

// Start webservice
app.listen(8080);
module.exports = lectures;