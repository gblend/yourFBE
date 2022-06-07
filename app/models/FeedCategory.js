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
        enum: ['enabled', 'disabled'],
        default: 'enabled',
    }
}, {timestamps: true});

const FeedCategory = mongoose.model('FeedCategory', FeedCategorySchema);

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

