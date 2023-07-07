import mongoose, { model, Schema } from 'mongoose';
import { IToken, TokenModel } from '../interface';

const TokenSchema = new Schema<IToken, TokenModel>(
  {
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
    },
  },
  { timestamps: true },
);

export const Token = model<IToken, TokenModel>('Token', TokenSchema);
