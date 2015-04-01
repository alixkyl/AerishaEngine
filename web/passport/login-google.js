
var GoogleStrategy	= require( 'passport-google-oauth2' ).Strategy;


module.exports = function(passport) {
  // Use the GoogleStrategy within Passport.
	passport.use('login-google',new GoogleStrategy({
		clientID:     nconf.get('GOOGLE:GOOGLE_CLIENT_ID') ,
		clientSecret: nconf.get('GOOGLE:GOOGLE_CLIENT_SECRET'),
		callbackURL: nconf.get('GOOGLE:GOOGLE_CALLBACK_URL'),
		passReqToCallback   : true
	  },
	  function(request, accessToken, refreshToken, profile, done) {
		process.nextTick(function () {
		  return done(null, profile);
		});
	  }
	));
};
