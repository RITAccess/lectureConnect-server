/*
 *	Accounts management page
 */

exports.index = function(req, res) {
	res.render('account', {
		title : "Accounts",
		account : req.user,
		active : "Account"
	});
}