var express = require('express');
var router = express.Router();
module.exports = function(passport){
 
	
	router.get('/',ensureAuthenticated, function(req, res) {
		res.render('editor', { message: req.flash('message') , user: req.user});
	});
	function ensureAuthenticated(req, res, next) {
		if (req.isAuthenticated()) { return next(); }
		res.redirect('/login');
	}
	
  return router;
}