import {StatusCodes} from 'http-status-codes';
import CustomAPIError from './custom_api';

class BadRequestError extends CustomAPIError {
    private statusCode: number;

    constructor(message: string) {
        super(message);
        this.statusCode = StatusCodes.BAD_REQUEST;
    }
}

export default BadRequestError;
