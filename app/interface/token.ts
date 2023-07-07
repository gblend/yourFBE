import { Model } from 'mongoose';
import { objectId } from '../types';

export interface IToken {
  refreshToken: string;
  ip: string;
  userAgent: string;
  isValid: boolean;
  user: objectId;
}

export interface TokenModel extends Model<IToken> {}
