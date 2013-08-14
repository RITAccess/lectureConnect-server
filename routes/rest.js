/*
 * RESTful api
 */

var mongoose = require('mongoose')
  , db = require('../db');

var Lecture = mongoose.model('Lecture');

exports.findall = function(req, res) {

	Lecture.find({isActive: true}, 'name', function(err, data) {
		if (err) {
			res.send(err);
		} else {
			res.header("Content-Type", "application/json");
			res.send(data);
		}

	});

};