'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const joi = require('joi');

const SavedForLaterSchema = new Schema({
    postId: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: {
            values: ['enabled', 'disabled'],
            messages: '{VALUE} is not acceptable'
        },
        default: 'enabled',
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {timestamps: true});
SavedForLaterSchema.index({user: 1, postId: 1}, {unique: true});

const SavedForLater = mongoose.model('SavedForLater', SavedForLaterSchema, 'savedForLater');

const validateSavedForLaterDto = (saveForLaterData) => {
    const saveForLater = joi.object({
        postId: joi.string().min(3).required(),
        user: joi.object().required(),
    });

    return saveForLater.validate(saveForLaterData);
}

module.exports = {
    SavedForLater,
    validateSavedForLaterDto
}
