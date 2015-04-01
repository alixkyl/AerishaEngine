var express = require('express');
var router = express.Router();
module.exports = function(passport){
 
	/* GET login page. */
	router.get('/',ensureAuthenticated, function(req, res) {
		// Display the Login page with any flash message, if any
		res.render('game', { message: req.flash('message') , user: req.user});
	});
	
	function ensureAuthenticated(req, res, next) {
		if (req.isAuthenticated()) { return next(); }
		res.redirect('/login');
	}
	
  return router;
}