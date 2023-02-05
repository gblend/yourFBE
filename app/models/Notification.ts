import {Schema, model} from 'mongoose';
import joi, {ValidationResult} from 'joi';
import {NotificationModel, INotificationDto, INotification} from '../interface';

const NotificationSchema = new Schema<INotification, NotificationModel>({
    text: {
        type: String,
        trim: true,
        required: true,
    },
    title: {
        type: String,
        trim: true,
        unique: true,
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

const Notification = model<INotification, NotificationModel>('Notification', NotificationSchema, 'notifications');

const validateNotificationDto = (notificationDto: INotificationDto): ValidationResult => {
    const notification = joi.object({
        text: joi.string().required(),
        title: joi.string().required()
    });
    return notification.validate(notificationDto);
}

const validateUpdateNotificationDto = (notificationUpdateDto: INotificationDto): ValidationResult => {
    const notification = joi.object({
        text: joi.string(),
        title: joi.string(),
        status: joi.string()
    });
    return notification.validate(notificationUpdateDto);
}

export {
    Notification,
    validateNotificationDto,
    validateUpdateNotificationDto
};


