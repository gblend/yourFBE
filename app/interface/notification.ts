import {Model} from 'mongoose';

interface INotification {
    text: string,
    title: string,
    status?: string
}

interface NotificationModel extends Model<INotification> {
}

interface INotificationDto {
    text?: string,
    title?: string,
    status?: string
}

export {
    NotificationModel,
    INotificationDto,
    INotification
}
