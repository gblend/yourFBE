const passport = require('passport');
const {User} = require('../models/User');


module.exports = function() {

	passport.serializeUser((user, cb) => {
		return cb(null, user);
	});

	passport.deserializeUser((userObj, cb) => {
		return User.findById(userObj._id, (err, user) => {
			return cb(err, user);
		});
	});

};
