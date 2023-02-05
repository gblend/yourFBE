import mongoose, {Schema, model} from 'mongoose';
import joi, {ValidationResult} from 'joi';
import {NotificationLogModel, INotificationLog} from '../interface';

const NotificationLogSchema = new Schema<INotificationLog, NotificationLogModel>({
    users: {
        type: String,
        trim: true,
        required: true,
    },
    notification: {
        type: mongoose.Types.ObjectId,
        ref: 'Notification',
        unique: true,
        required: true,
    },

}, {timestamps: true});

const NotificationLog = model<INotificationLog, NotificationLogModel>('NotificationLog', NotificationLogSchema, 'notificationsLog');

const validateNotificationLogDto = (notificationLogDto: INotificationLog): ValidationResult => {
    const notificationLog = joi.object({
        users: joi.string().required(),
        notification: joi.object().required()
    });
    return notificationLog.validate(notificationLogDto);
}


export {
    NotificationLog,
    validateNotificationLogDto,
};


