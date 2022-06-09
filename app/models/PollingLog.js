'use strict';

const mongoose = require('mongoose');
const joi = require('joi');
const Schema = mongoose.Schema;

const PollingLogSchema = new Schema({
    url: {
        type: String,
        trim: true,
        required: true,
    },
    status: {
        type: String,
        enum: {
            values: ['completed', 'failed', 'exception'],
            messages: '{VALUE} is not acceptable'
        },
        default: 'completed',
    }
}, {timestamps: true});

const PollingLog = mongoose.model('PollingLog', PollingLogSchema);

const validatePollingLogDto = (pollingLogSchema) => {
    const pollingLog = joi.object({
        url: joi.string().uri().required()
    });
    return pollingLog.validate(pollingLogSchema);
}

module.exports = {
    PollingLog,
    validatePollingLogDto
}
