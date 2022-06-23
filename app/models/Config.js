'use strict';

const mongoose = require('mongoose');
const joi = require('joi');
const Schema = mongoose.Schema;

const ConfigDataSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    path: {
        type: String,
        trim: true,
        unique: true,
        required: true,
    },
    value: {
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
    }
}, {timestamps: true});
ConfigDataSchema.index({path: 1}, {unique: true});

const ConfigData = mongoose.model('ConfigData', ConfigDataSchema, 'configData');

const validateConfigDataDto = (configDataPayload) => {
    const configData = joi.object({
        name: joi.string().required(),
        path: joi.string().required(),
        value: joi.string().required()
    });
    return configData.validate(configDataPayload);
}
module.exports = {
    ConfigData,
    validateConfigDataDto
};


