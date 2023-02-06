import {model, Schema, CallbackWithoutResultAndOptionalError} from 'mongoose';
import joi, {ValidationResult} from 'joi';
import bcrypt from 'bcryptjs';
import {createJWT, capitalizeFirstCharacter} from '../lib/utils';
import {ITokenUser, IUser, IUpdatePassword, UserModel, IUserMethods} from '../interface';

const UserSchema = new Schema<IUser, UserModel, IUserMethods>({
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
		lowercase: true,
	},
	password: {
		type: String,
		minlength: 8,
	},
	passwordConfirmation: {
		type: String,
		minlength: 8,
	},
	role: {
		type: String,
		enum: {
			values: ['admin', 'user'],
			messages: '{VALUE} is not acceptable.'
		},
		default: 'user',
	},
	gender: {
		type: String,
		enum: {
			values: ['male', 'female', 'NA'],
			messages: '{VALUE} is not acceptable.'
		},
		default: 'NA',
	},
	status: {
		type: String,
		enum: {
			values: ['enabled', 'disabled'],
			messages: '{VALUE} is not acceptable'
		},
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
		default: '/uploads/default_avatar.jpeg',
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
UserSchema.index({email: 1}, {unique: true});

UserSchema.virtual('savedForLater', {
	ref: 'SavedForLater',
	localField: '_id',
	foreignField: 'user',
	justOne: false
});

UserSchema.virtual('followedFeeds', {
	ref: 'FollowedFeed',
	localField: '_id',
	foreignField: 'user',
	justOne: false
});

UserSchema.pre('save', async function (next: CallbackWithoutResultAndOptionalError): Promise<void> {
	await this.$model('SavedForLater').deleteMany({user: this._id});
	await this.$model('FollowedFeed').deleteMany({user: this._id});
	next();
});

const validateUserDto = (userDto: IUser): ValidationResult => {
	const user = joi.object({
		firstname: joi.string().min(3).required(),
		lastname: joi.string().min(3).required(),
		email: joi.string().email().required(),
		password: joi.string().min(8).required(),
		passwordConfirmation: joi.string().valid(joi.ref('password')).required(),
	})

	return user.validate(userDto);
}

const validateUpdatePassword = (updatePasswordDto: IUpdatePassword): ValidationResult => {
	const password = joi.object({
		oldPassword: joi.string().min(8).required(),
		newPassword: joi.string().min(8)
			.required()
	})

	return password.validate(updatePasswordDto);
}

const validateUpdateUser = (updateUserDto: IUser): ValidationResult => {
	const userUpdate = joi.object({
		firstname: joi.string().min(3),
		lastname: joi.string().min(3),
		email: joi.string().email(),
	});

	return userUpdate.validate(updateUserDto);
}

const validateLogin = (loginDto: IUser): ValidationResult => {
	const login = joi.object({
		email: joi.string().email().required(),
		password: joi.string().min(8).required()
	});

	return login.validate(loginDto);
}

UserSchema.pre('save', async function (next: CallbackWithoutResultAndOptionalError): Promise<void> {
	if (this.isModified('firstname') || this.isModified('lastname')) {
		capitalizeFirstCharacter(this.firstname as string, this.lastname as string);
	}
	if (!this.isModified('password') || !this.password) {
		return next();
	}
	const salt = await bcrypt.genSalt(12);
	this.password = await bcrypt.hash(this.password, salt);
	this.passwordConfirmation = undefined;

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

UserSchema.static('_createJWT', function _createJWT(jwtUserDto: {name: string, _id: string, role: string}): string {
	return createJWT(jwtUserDto);
});

UserSchema.methods.createRefreshJWT = (user: ITokenUser, refreshToken: string): string => {
	const userPayload = {name: `${user.firstname} ${user.lastname}`, id: user._id, role: user.role}
	return createJWT({user: userPayload, refreshToken});
}

UserSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
	return await bcrypt.compare(enteredPassword, this.password);
}

const User = model<IUser, UserModel>('User', UserSchema);

export {
	User,
	validateUserDto,
	validateLogin,
	validateUpdateUser,
	validateUpdatePassword
}
