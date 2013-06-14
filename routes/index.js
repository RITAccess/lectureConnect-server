
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

	Lecture.find({isActive: true}).exec(function(err, data){

		res.render('index', { 
	  		title: 'LectureConnect',
	  		lectures : data,
	  		clients : app.clientCount(),
	  		lectureCount : data.length,
	  		account : req.user,
	  		active : "Dashboard"
  		});

	});
};

exports.create = function(req, res) {
	if (req.query.name != null && req.query.desc != null) {
		var newLect = new Lecture({
			name: req.query.name,
			description: req.query.desc,
			data: ['Test Data']
		});
		newLect.save(function(err, obj){
			if (err) console.log("Did not save");
			if (req.query.startActive) {
				res.redirect('/start/'+obj._id);
			} else {
				res.redirect('/');
			}
		});
	}
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




