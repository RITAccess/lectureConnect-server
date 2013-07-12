
/*
 * GET home page.
 */

var LectureRuntime = require('../LectureRuntime')
  , lectures = require('../lectures')
  , app = require('../app')
  , mongoose = require('mongoose')
  ,	db = require('../db');

var Lecture = mongoose.model('Lecture');
var System = mongoose.model('System');

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
			data: []
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
		
		// Get runtime if active
		if (data.isActive) {
			var runtime = lectures[data.name];
			var clients = runtime.getClients();
		} else {
			var clients = [];
		}

		// Get information about streamer if available
		var stream_status = "error";
		var stream_host = "No Server Connected";
		if (runtime) {
			var info;
			if(info = runtime.getStreamInfo()) {
				stream_status = "success";
				stream_host = info;
			}
		}

		System.findOne().exec(function(err, sys){
			res.render('lectures', {
				account : req.user,
				title: data.name,
				lecture: data,
				clients : clients,
				status : data.isActive ? "success" : "error",
				stream_status : stream_status,
				stream_host : stream_host,
				hostname : sys.hostname
			});
		});

	});
}

exports.signin = function(req, res) {
	res.render('signin', {title : 'LectureConnect'});
}




