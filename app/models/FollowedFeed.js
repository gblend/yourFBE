'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const joi = require('joi');

const FollowedFeedSchema = new Schema({
    feed: {
        type: mongoose.Types.ObjectId,
        ref: 'Feed',
        required: true,
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {timestamps: true, toJSON: {virtuals: true}, toObject: {virtuals: true}});
FollowedFeedSchema.index({user: 1, feed: 1}, {unique: true});

FollowedFeedSchema.virtual('feedFollowers', {
    ref: 'User',
    localField: 'user',
    foreignField: '_id',
    justOne: false
});

FollowedFeedSchema.virtual('feedFollowed', {
    ref: 'Feed',
    localField: 'feed',
    foreignField: '_id',
    justOne: false
});

const FollowedFeed = mongoose.model('FollowedFeed', FollowedFeedSchema);

const validateFollowedFeedDto = (followedFeedData) => {
    const followedFeed = joi.object({
        feed: joi.object().required(),
        user: joi.object().required(),
    });

    return followedFeed.validate(followedFeedData);
}

module.exports = {
    FollowedFeed,
    validateFollowedFeedDto
}
