import mongoose, {model, ObjectId, Schema} from 'mongoose';
import joi, {ValidationResult} from 'joi';
import {ISavedForLater, SavedForLaterModel} from '../interface';

const SavedForLaterSchema = new Schema<ISavedForLater, SavedForLaterModel>({
    post: {
        type: Object,
        required: true,
    },
    status: {
        type: String,
        enum: {
            values: ['enabled', 'disabled', 'read'],
            messages: '{VALUE} is not acceptable'
        },
        default: 'enabled',
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    feed: {
        type: mongoose.Types.ObjectId,
        ref: 'Feed',
        required: true,
    },
}, {timestamps: true});

const SavedForLater = model<ISavedForLater, SavedForLaterModel>('SavedForLater', SavedForLaterSchema, 'savedForLater');

const validateSavedForLaterDto = (saveForLaterDto: { post: any, feed: ObjectId, user: ObjectId }): ValidationResult => {
    const saveForLater = joi.object({
        post: joi.object().required(),
        feed: joi.object().required(),
        user: joi.object().required(),
    });

    return saveForLater.validate(saveForLaterDto);
}

export {
    SavedForLater,
    validateSavedForLaterDto
}
