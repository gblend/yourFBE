import mongoose from 'mongoose';
import {objectId} from '../../types';

const createObjectId = (id: objectId): mongoose.Types.ObjectId => {
	return new mongoose.Types.ObjectId(id);
}

export {
	createObjectId
}
