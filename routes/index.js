
/*
 * GET home page.
 */

var Lecture = require('../LectureRuntime')
  , lectures = require('../lectures')
  , app = require('../app');

exports.index = function(req, res){

	var lectureCount = 0;
	for (_ in lectures) lectureCount++;

  	res.render('index', { 
  		title: 'LectureConnect',
  		lectures : lectures,
  		clients : app.clientCount(),
  		lectureCount : lectureCount,
  		account : req.user,
  		active : "Dashboard"
  	});
};

exports.create = function(req, res) {
	if (req.query.name != null) {
		var run = new Lecture(req.query.name, req.query.desc);
		lectures[req.query.name] = run;
		run.start();
	}
	res.redirect('/');
}

exports.destroy = function(req, res) {
	if (req.query.name != null) {
		var lecture = lectures[req.query.name];
		lecture.stop();
		delete lecture;
		delete lectures[req.query.name];
	}
	res.redirect('/');
}

exports.lecture = function(req, res) {
	res.send(req.params.id);
}

exports.signin = function(req, res) {
	res.render('signin', {title : 'LectureConnect'});
}