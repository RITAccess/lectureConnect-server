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
mongoose.connect('mongodb://localhost/development');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {

	// Define Schemas
	// Lecture
	var lectureSchema = new mongoose.Schema({ 
		name: String, 
		date : { type : Number, default : Date.parse(new Date()) / 1000 },
		data : []
	});
	var Lecture = mongoose.model('Lecture', lectureSchema);

	read.on('line', function(passin){
		if (passin == '')  { 
			console.log("Done");
			process.exit(0);
		}
		// Create Data
		var test = new Lecture({
			name : passin,
			data : ['Test Data', 'More Test Data']
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
