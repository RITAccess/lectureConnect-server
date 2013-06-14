var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/development');
var db = mongoose.connection;

// Define Schemas
// Lecture
var lectureSchema = new mongoose.Schema({ 
	name: String, 
	description: String,
	date : { type : Number, default : Date.parse(new Date()) / 1000 },
	isActive: { type: Boolean, default: false },
	data : []
});
mongoose.model('Lecture', lectureSchema);

var userSchema = new mongoose.Schema({
	name: String,
	account: String,
	passhash: String
});
mongoose.model('Users', userSchema);

module.exports = db;
