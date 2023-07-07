import { model, Schema } from 'mongoose';
import joi, { ValidationResult } from 'joi';
import { ConfigModel, IConfig, IConfigDto } from '../interface';

const ConfigDataSchema = new Schema<IConfig, ConfigModel>(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    path: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    value: {
      type: String,
      trim: true,
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ['enabled', 'disabled'],
        messages: '{VALUE} is not acceptable',
      },
      default: 'enabled',
    },
  },
  { timestamps: true },
);
ConfigDataSchema.index({ path: 1 }, { unique: true });

const ConfigData = model<IConfig, ConfigModel>(
  'ConfigData',
  ConfigDataSchema,
  'configData',
);

const validateConfigDataDto = (configDataDto: IConfigDto): ValidationResult => {
  const configData = joi.object({
    name: joi.string().required(),
    path: joi.string().required(),
    value: joi.string().required(),
  });
  return configData.validate(configDataDto);
};

export { ConfigData, validateConfigDataDto };
