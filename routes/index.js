
/*
 * GET home page.
 */

var LectureRuntime = require('../LectureRuntime')
  , lectures = require('../lectures')
  , app = require('../app')
  , mongoose = require('mongoose')
  ,	db = require('../db');

var Lecture = mongoose.model('Lecture');

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
		var newLect = new Lecture({
			name: req.query.name,
			description: req.query.desc,
			data: ['Test Data']
		});
		newLect.save(function(err, obj){
			if (err) console.log("Did not save");
		});
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
	var query = Lecture.findOne({_id : req.params.id});
	query.exec(function(err, data){
		res.render('lectures', {
			title: data.name,
			lecture: data
		});
	});
}

exports.signin = function(req, res) {
	res.render('signin', {title : 'LectureConnect'});
}




