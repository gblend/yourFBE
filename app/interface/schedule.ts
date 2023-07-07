import { Model } from 'mongoose';

export interface ISchedule {
  code: string;
  started_at: Date;
  ended_at?: Date;
  status?: string;
}

export interface ScheduleModel extends Model<ISchedule> {}
