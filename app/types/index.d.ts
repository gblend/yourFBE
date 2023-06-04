export {Request, Response, Application, NextFunction, ErrorRequestHandler} from 'express';
import {ObjectId} from 'mongoose';
type objectId = typeof ObjectId

export {
    objectId
};

declare global {
    namespace Express {
        interface Request {
            cookie: any,
            socialProfile: any
            fields: any
        }
    }
}
