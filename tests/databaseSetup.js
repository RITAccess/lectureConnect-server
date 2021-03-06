// Creates a defult database with starting data in it.
// Author: Michael Timbrook <mpt2360@rit.edu>

// requires
var readline = require('readline');
var read = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Connect to database
var mongoose = require('mongoose');
var db = require('../db');
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {

	// Grab Schema
	var Lecture = mongoose.model('Lecture');
	var User = mongoose.model('Users');
	var System = mongoose.model('System');

	var crypto = require('crypto');
	var sha512 = crypto.createHash('sha512');
	sha512.update("admin");
	var hash = sha512.digest('hex');

	var admin = new User({
		name: "Admin",
		account: "admin",
		passhash: hash
	});

	admin.save();

	var sys = new System({
		hostname : ""
	});
	sys.save();

	read.on('line', function(passin){
		if (passin == '')  { 
			console.log("Done");
			process.exit(0);
		}
		// Create Data
		var test = new Lecture({
			name : passin,
			description: "Test Description",
			data : []
		});

		test.save(function(err, obj) {
			if(err) {
				console.log(err);
			} else {
				console.log("Saved");
			}
		});
	});

});
