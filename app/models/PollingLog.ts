import { model, Schema } from 'mongoose';
import joi, { ValidationResult } from 'joi';
import { IPollingDto, PollingDtoModel } from '../interface';

const PollingLogSchema = new Schema<IPollingDto, PollingDtoModel>(
  {
    url: {
      type: String,
      trim: true,
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ['completed', 'failed', 'exception'],
        messages: '{VALUE} is not acceptable',
      },
      default: 'completed',
    },
  },
  { timestamps: true },
);

const PollingLog = model<IPollingDto, PollingDtoModel>(
  'PollingLog',
  PollingLogSchema,
);

const validatePollingLogDto = (
  pollingLogSchema: IPollingDto,
): ValidationResult => {
  const pollingLog = joi.object({
    url: joi.string().uri().required(),
  });
  return pollingLog.validate(pollingLogSchema);
};

export { PollingLog, validatePollingLogDto };
