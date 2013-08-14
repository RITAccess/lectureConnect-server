/*
 * RESTful api
 */

var mongoose = require('mongoose')
  , db = require('../db');

var Lecture = mongoose.model('Lecture');

exports.findall = function(req, res) {

	Lecture.find({isActive: true}).exec(function(err, data) {
		if (err) {
			res.send(err);
		} else {
			res.send(data);
		}

	});

};