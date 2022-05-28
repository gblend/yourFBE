'use strict';

const mongoose = require('mongoose');
const joi = require('joi');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const {createJWT, capitalizeFirstCharacter} = require('../lib/utils');

const UserSchema = new Schema({
    firstname: {
        type: String,
        minlength: 3,
        trim: true,
    },
    lastname: {
        type: String,
        minlength: 3,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        minlength: 8,
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    },
    status: {
        type: String,
        enum: ['enabled', 'disabled'],
        default: 'enabled',
    },
    socialChannel: {
        type: String,
        trim: true,
    },
    socialChannelId: {
        type: String,
        trim: true,
    },
    avatar: {
        type: String,
        default: '/uploads/default-avatar.jpeg',
        trim: true,
    },
    verificationToken: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verified: {
        type: Date
    },
    lastLogin: {
        type: Date,
    },
    passwordToken: {
        type: String
    },
    passwordTokenExpirationDate: {
        type: Date
    }
}, {timestamps: true, toJSON: {virtuals: true}, toObject: {virtuals: true}});

UserSchema.virtual('savedForLater', {
    ref: 'SavedForLater',
    localField: '_id',
    foreignField: 'user',
    justOne: false
});

UserSchema.virtual('followedFeed', {
    ref: 'FollowedFeed',
    localField: '_id',
    foreignField: 'user',
    justOne: false
});

UserSchema.pre('remove', async function (next) {
    await this.model('SavedForLater').deleteMany({user: this._id});
    next();
});
UserSchema.pre('remove', async function (next) {
    await this.model('FollowedFeed').deleteMany({user: this._id});
    next();
});

const validateUserDto = (userSchema) => {
    const user = joi.object({
        firstname: joi.string().min(3).required(),
        lastname: joi.string().min(3).required(),
        email: joi.string().email().required(),
        password: joi.string().min(8).required()
    })

    return user.validate(userSchema);
}

const validateUpdatePassword = (payload) => {
    const password = joi.object({
        oldPassword: joi.string().min(8).required(),
        newPassword: joi.string().min(8)
            .required()
    })

    return password.validate(payload);
}

const validateUpdateUser = (userData) => {
    const userUpdate = joi.object({
        firstname: joi.string().min(3).required(),
        lastname: joi.string().min(3).required(),
        email: joi.string().email().required(),
    });

    return userUpdate.validate(userData);
}

const validateLogin = (credentials) => {
    const login = joi.object({
        email: joi.string().email().required(),
        password: joi.string().required()
    });

    return login.validate(credentials);
}

UserSchema.pre('save', async function (req, res, next) {
    if (this.isModified('firstname') || this.isModified('lastname')) {
        capitalizeFirstCharacter(this.firstname, this.lastname);
    }
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.methods.createJWT = function () {
    const payload = {
        name: `${this.firstname} ${this.lastname}`,
        id: this._id,
        role: this.role
    }
    return createJWT(payload);
}

UserSchema.methods.createRefreshJWT = function (user, refreshToken) {
    const userPayload = {name: `${user.firstname} ${user.lastname}`, id: user._id, role: user.role}
    return createJWT({user: userPayload, refreshToken});

}

UserSchema.methods.comparePassword = function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
}

const User = mongoose.model('User', UserSchema);

module.exports = {
    User,
    validateUserDto,
    validateLogin,
    validateUpdateUser,
    validateUpdatePassword
};
