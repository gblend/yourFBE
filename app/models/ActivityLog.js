'use strict';

const mongoose = require('mongoose');
const joi = require('joi');
const Schema = mongoose.Schema;

const ActivityLogSchema = new Schema({
    action: {
        type: String,
        trim: true,
        required: true,
    },
    resourceName: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, {timestamps: true});

const ActivityLog = mongoose.model('ActivityLog', ActivityLogSchema);

const validateActivityLogDto = (activityLogSchema) => {
    const activityLog = joi.object({
        action: joi.string().required(),
        resourceName: joi.string().required(),
        user: joi.object().required()
    });
    return activityLog.validate(activityLogSchema);
}

module.exports = {
    ActivityLog,
    validateActivityLogDto
}
