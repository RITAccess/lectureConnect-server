/*
 *	Accounts management page
 */
var mongoose = require('mongoose')
  ,	db = require('../db');

exports.index = function(req, res) {

	

	
	res.render('account', {
		title : "Accounts",
		account : req.user,
		active : "Account"
	});
}

exports.changepassword = function(req, res) {
	var User = mongoose.model('Users');
	User.findOne({name : req.user}).exec(function(err, userAccount) {
		if (err) console.log("Error");
		if (userAccount == null) {
			res.send(500);
		} else {
			// Begin check
			var crypto = require('crypto');
			var sha512 = crypto.createHash('sha512');
			sha512.update(req.body.password);
			var hash = sha512.digest('hex');
			if (userAccount.passhash == hash && req.body.newPass == req.body.passcheck) {
				// Begin crypto
				var crypto = require('crypto');
				var sha512 = crypto.createHash('sha512');
				sha512.update(req.body.newPass);
				var hash = sha512.digest('hex');
				// update password
				userAccount.passhash = hash;
				userAccount.save(function(err, obj){
					res.render('account', {
						title : "Accounts",
						account : req.user,
						active : "Account"
					});
				});
			}
		}
	});
}