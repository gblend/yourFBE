import mongoose, {Model, model, Schema} from 'mongoose';
import joi, {ValidationResult} from 'joi';
import {IActivityDto, IActivityLog, ActivityLogModel} from '../interface';

const ActivityLogSchema = new Schema<IActivityLog, ActivityLogModel>({
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

const ActivityLog = model<IActivityLog, ActivityLogModel>('ActivityLog', ActivityLogSchema);

const validateActivityLogDto = (activityLogDto: IActivityDto):
    ValidationResult => {

    const activityLog = joi.object({
        action: joi.string().required(),
        resourceName: joi.string().required(),
        user: joi.object().required()
    });
    return activityLog.validate(activityLogDto);
}

export {
    ActivityLog,
    validateActivityLogDto
}
