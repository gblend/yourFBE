import mongoose, { model, Schema } from 'mongoose';
import { ISchedule, ScheduleModel } from '../interface';

const ScheduleSchema: mongoose.Schema<ISchedule, ScheduleModel> = new Schema<
  ISchedule,
  ScheduleModel
>(
  {
    code: {
      type: String,
      required: true,
    },
    started_at: {
      type: Date,
      required: true,
    },
    ended_at: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'running', 'completed'],
        messages: '{VALUE} is not acceptable.',
      },
      default: 'pending',
    },
  },
  { timestamps: true },
);

export const Schedule: ScheduleModel = model<ISchedule, ScheduleModel>(
  'Schedule',
  ScheduleSchema,
);
