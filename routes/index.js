
/*
 * GET home page.
 */

var Lecture = require('../LectureRuntime')
  , lectures = require('../lectures');

exports.index = function(req, res){
  	res.render('index', { title: 'LectureConnect', lectures : lectures });
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