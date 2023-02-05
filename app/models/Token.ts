import mongoose, {Schema, model} from 'mongoose';
import {IToken, TokenModel} from '../interface';

const TokenSchema = new Schema<IToken, TokenModel>({
    refreshToken: {
        type: String,
        required: true,
    },
    ip: {
        type: String,
        required: true,
    },
    userAgent: {
        type: String,
        required: true,
    },
    isValid: {
        type: Boolean,
        default: true,
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, {timestamps: true});

const Token = model<IToken, TokenModel>('Token', TokenSchema);

export {
    Token
}
