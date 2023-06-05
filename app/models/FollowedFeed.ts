import mongoose, {model, Schema} from 'mongoose';
import joi, {ValidationResult} from 'joi';
import {FollowedFeedModel, IFollowCategoryFeed, IFollowedFeed} from '../interface';

const FollowedFeedSchema = new Schema<IFollowedFeed, FollowedFeedModel>({
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

const FollowedFeed = model<IFollowedFeed, FollowedFeedModel>('FollowedFeed', FollowedFeedSchema);

const validateFollowedFeedDto = (followedFeedDto: IFollowedFeed): ValidationResult => {
    const followedFeed = joi.object({
        feed: joi.object().required(),
        user: joi.object().required(),
    });

    return followedFeed.validate(followedFeedDto);
}

const validateFollowFeedsInCategoryDto = (followCategoryFeedsDto: IFollowCategoryFeed): ValidationResult => {
    const followCategoryFeeds = joi.object({
        category: joi.object().required(),
        user: joi.object().required(),
    });

    return followCategoryFeeds.validate(followCategoryFeedsDto);
}

export {
    FollowedFeed,
    validateFollowFeedsInCategoryDto,
    validateFollowedFeedDto
}
