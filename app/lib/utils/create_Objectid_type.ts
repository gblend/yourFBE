import mongoose from 'mongoose';
import { objectId } from '../../types';

export const createObjectId = (id: objectId): mongoose.Types.ObjectId => {
  return new mongoose.Types.ObjectId(id);
};
