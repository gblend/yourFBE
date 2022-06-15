'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const joi = require('joi');

const FeedSchema = new Schema({
    url: {
        type: String,
        trim: true,
        required: true,
    },
    title: {
        type: String,
        trim: true,
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
    description: {
        type: String,
        trim: true,
        maxlength: [1000, 'Description cannot be more than 1000 characters'],
    },
    logoUrl: {
        type: String,
        trim: true,
    },
    category: {
        type: mongoose.Types.ObjectId,
        ref: 'FeedCategory',
        required: true,
    },
    socialHandle: {
        type: String,
        trim: true,
    },
    socialPage: {
        type: String,
        trim: true,
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {timestamps: true});

const Feed = mongoose.model('Feed', FeedSchema);

const validateFeedDto = (feedData) => {
    const feed = joi.object({
        url: joi.string().uri().required(),
        title: joi.string(),
        status: joi.number(),
        description: joi.string().min(10),
        logoUrl: joi.string(),
        category: joi.string().required(),
        socialHandle: joi.string(),
        socialPage: joi.string(),
        user: joi.object().required(),
    });

    return feed.validate(feedData);
}

const validateFeedUpdateDto = (feedUpdateData) => {
    const feedUpdate = joi.object({
        url: joi.string().uri(),
        title: joi.string(),
        description: joi.string().min(10),
        logoUrl: joi.string(),
        category: joi.string(),
        socialHandle: joi.string(),
        socialPage: joi.string(),
    });

    return feedUpdate.validate(feedUpdateData);
}

module.exports = {
    Feed,
    validateFeedDto,
    validateFeedUpdateDto,
}
