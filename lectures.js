var lr = require('./LectureRuntime');


var lectures = {}
exports = lectures;

exports.createLecture = function(name) {
	var lecture = new lr(name);
	lecture.start();
}