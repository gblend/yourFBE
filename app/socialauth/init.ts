import passport from 'passport';
import { User } from '../models';
import { ITokenUser, IUser } from '../interface';
import { ErrorRequestHandler } from '../types/index';

export = () => {
  passport.serializeUser((user: object, cb: (...args: any) => any): void => {
    return cb(null, user);
  });

  passport.deserializeUser(
    (userObj: ITokenUser, cb: (...payload: any) => any) => {
      return User.findById(
        userObj._id,
        (err: ErrorRequestHandler, user: IUser) => {
          return cb(err, user);
        },
      );
    },
  );
};
