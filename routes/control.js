/*
 * Control Lecture runtimes
 */

var LectureRuntime = require('../LectureRuntime')
  , lectures = require('../lectures')
  , app = require('../app')
  , mongoose = require('mongoose')
  ,	db = require('../db');

var Lecture = mongoose.model('Lecture');

exports.start = function(req, res) {
	// Get lecture
	Lecture.findOne({_id : req.params.id}).exec(function(err, obj){
		if (err){
			console.log("Error");
		} else {
			// start runtime	
			var lectureRuntime = new LectureRuntime(obj.name, obj.description, obj);
			lectures[obj.name] = lectureRuntime;
			// update status
			obj.isActive = true;
			obj.save();
		}
	});
	res.redirect('/lecture/'+req.params.id);
}

exports.destroy = function(req, res) {
	// Get lecture
	Lecture.findOne({_id : req.params.id}).exec(function(err, obj){
		if (err){
			console.log("Error");
		} else {
			var lecture = lectures[obj.name];
			lecture.stop();
			delete lecture;
			delete lectures[obj.name];
			obj.isActive = false;
			obj.save();
		}
	});
	res.redirect('/lecture/'+req.params.id);
}

exports.cleardata = function(req, res) {
	Lecture.findOne({_id : req.params.id}).exec(function(err, obj){
		if (err){
			console.log("Error");
		} else {
			delete obj.data;
			obj.data = [];
			obj.save();
		}
	});
	res.redirect('/lecture/'+req.params.id);
}
