import { Request, Response, Application, NextFunction, ErrorRequestHandler } from 'express';
import {ObjectId} from 'mongoose';
type objectId = typeof ObjectId

export {
    Response,
    Request,
    Application,
    NextFunction,
    ErrorRequestHandler,
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
