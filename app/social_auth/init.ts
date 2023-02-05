import passport from 'passport';
import {User} from '../models/User';
import {ITokenUser, IUser} from '../interface';
import {ErrorRequestHandler} from '../types/index';



export = function() {

	passport.serializeUser((user, cb: Function): void => {
		return cb(null, user);
	});

	passport.deserializeUser((userObj: ITokenUser, cb: Function) => {
		return User.findById(userObj._id, (err: ErrorRequestHandler, user: IUser) => {
			return cb(err, user);
		});
	});

};
