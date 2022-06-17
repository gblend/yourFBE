'use strict';

const mongoose = require('mongoose');
const joi = require('joi');
const Schema = mongoose.Schema;

const FeedCategorySchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    description: {
        type: String,
        trim: true,
        maxlength: [1000, 'Description cannot be more than 1000 characters'],
        required: true,
    },
    status: {
        type: String,
        enum: {
            values: ['enabled', 'disabled'],
            messages: '{VALUE} is not acceptable'
        },
        default: 'enabled',
    }
}, {timestamps: true});

const FeedCategory = mongoose.model('FeedCategory', FeedCategorySchema);

FeedCategorySchema.virtual('categoryFeeds', {
    ref: 'Feed',
    localField: '_id',
    foreignField: 'category',
    justOne: false,
    count: true,
});

const validateFeedCategoryDto = (feedCategoryData) => {
    const feedCategory = joi.object({
        name: joi.string().required(),
        description: joi.string().required()
    });
    return feedCategory.validate(feedCategoryData);
}
module.exports = {
    FeedCategory,
    validateFeedCategoryDto
};


