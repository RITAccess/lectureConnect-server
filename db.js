var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/development');
var db = mongoose.connection;
module.exports = db;