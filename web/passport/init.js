"use strict";

var mongoose = require( 'mongoose');
var User = require( '../schema/user.js');
module.exports = function(nconf,passport) {
	mongoose.connect(nconf.get('MONGOD:url') );
	
	passport.serializeUser(function(user, done) {
	  done(null, user._id);
	});
	 
	passport.deserializeUser(function(id, done) {
	  User.findById(id, function(err, user) {
		done(err, user);
	  });
	});
	
	require('./login.js')(passport);
	require('./signup.js')(passport);
};
