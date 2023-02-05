import {StatusCodes} from 'http-status-codes';
import CustomAPIError from './custom_api';

class UnauthenticatedError extends CustomAPIError {
    private statusCode: number;

    constructor(message: string) {
        super(message);
        this.statusCode = StatusCodes.UNAUTHORIZED;
    }
}

export default UnauthenticatedError;
