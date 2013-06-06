
/*
 * GET home page.
 */

var Lecture = require('../LectureRuntime')
  , lectures = require('../lectures')
  , app = require('../app');

exports.index = function(req, res){
  	res.render('index', { 
  		title: 'LectureConnect',
  		lectures : lectures,
  		clients : app.clientCount(),
  		account : req.user
  	});
};

exports.create = function(req, res) {
	if (req.query.name != null) {
		var run = new Lecture(req.query.name);
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

exports.signin = function(req, res) {
	res.render('signin', {title : 'LectureConnect'});
}