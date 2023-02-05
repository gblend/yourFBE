import {Model} from 'mongoose';
import {objectId} from '../types'

interface INotificationLog {
    users: string,
    notification: objectId
}

interface NotificationLogModel extends Model<INotificationLog> {}

export {
    NotificationLogModel,
    INotificationLog
}
