var express = require('express');
var router = express.Router();
module.exports = function(passport){
 
	/* GET login page. */
	router.get('/', function(req, res) {
		// Display the Login page with any flash message, if any
		res.render('index', { message: req.flash('message') , user: req.user});
	});
	router.get('/login', function(req, res) {
		// Display the Login page with any flash message, if any
		res.render('login', { message: req.flash('message') });
	});
	/* Handle Login POST */
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/',
		failureRedirect: '/',
		failureFlash : true 
	}));
 
	/* GET Registration Page */
	router.get('/signup', function(req, res){
		res.render('register',{message: req.flash('message')});
	});
	// GET /auth/google
	//   Use passport.authenticate() as route middleware to authenticate the
	//   request.  The first step in Google authentication will involve
	//   redirecting the user to google.com.  After authorization, Google
	//   will redirect the user back to this application at /auth/google/callback
	router.get('/auth/google', passport.authenticate('google', { scope: [
		   'https://www.googleapis.com/auth/plus.login',
		   'https://www.googleapis.com/auth/plus.profile.emails.read'] 
	}));

	// GET /auth/google/callback
	//   Use passport.authenticate() as route middleware to authenticate the
	//   request.  If authentication fails, the user will be redirected back to the
	//   login page.  Otherwise, the primary route function function will be called,
	//   which, in this example, will redirect the user to the home page.
	router.get( '/oauth2callback', 
			passport.authenticate( 'google', { 
				successRedirect: '/',
				failureRedirect: '/auth/google'
	}));
	
	/* Handle Registration POST */
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/',
		failureRedirect: '/signup',
		failureFlash : true 
	}));
	
	/* Handle Logout */
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
	
  return router;
}