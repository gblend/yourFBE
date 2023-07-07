import { Model } from 'mongoose';

interface IActivityDto extends IActivityLog, IRequestInfo {}

interface IPollingDto extends IRequestInfo {
  url: string;
  status?: string;
}

interface PollingDtoModel extends Model<IPollingDto> {}

interface IRequestInfo {
  method?: string;
  path?: string;
}

interface IActivityLog {
  action: string;
  resourceName: string;
  user: any;
}

interface ActivityLogModel extends Model<IActivityLog> {}

export {
  IActivityDto,
  IPollingDto,
  IActivityLog,
  ActivityLogModel,
  PollingDtoModel,
};
