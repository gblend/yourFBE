'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const joi = require('joi');

const SavedForLaterSchema = new Schema({
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
SavedForLaterSchema.index({user: 1, postId: 1}, {unique: true});

const SavedForLater = mongoose.model('SavedForLater', SavedForLaterSchema, 'savedForLater');

const validateSavedForLaterDto = (saveForLaterData) => {
    const saveForLater = joi.object({
        postObject: joi.object().required(),
        feed: joi.object().required(),
        user: joi.object().required(),
    });

    return saveForLater.validate(saveForLaterData);
}

module.exports = {
    SavedForLater,
    validateSavedForLaterDto
}
