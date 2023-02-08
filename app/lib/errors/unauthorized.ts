import {StatusCodes} from 'http-status-codes';
import CustomAPIError from './custom_api';

class UnauthorizedError extends CustomAPIError {
    readonly statusCode: number;

    constructor(message: string) {
        super(message);
        this.statusCode = StatusCodes.FORBIDDEN;
    }
}

export default UnauthorizedError;
