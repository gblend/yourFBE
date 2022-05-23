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
}, { timestamps: true});
FollowedFeedSchema.index({user: 1, feed: 1}, { unique: true });

const FollowedFeed = mongoose.model('FollowedFeed', FollowedFeedSchema);
FollowedFeedSchema.virtual('user',{
    ref: 'User',
    localField: 'user',
    foreignField: '_id',
    justOne: false
});

FollowedFeedSchema.virtual('feed',{
    ref: 'Feed',
    localField: 'feed',
    foreignField: '_id',
    justOne: false
});

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
