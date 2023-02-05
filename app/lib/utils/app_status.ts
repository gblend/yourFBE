import packJson from '../../../package.json';
import {logger} from './logger';
import {config} from '../../config/config';
import {IAppStatus} from '../../interface';

const appStatus = {
    getGeneralInfo(): IAppStatus {
        const application: IAppStatus = {
            node_version: process.version,
            dep_versions: packJson.dependencies,
            name: config.app.name,
            platform: process.platform,
            memory_usage: process.memoryUsage(),
            uptime_min: process.uptime() / 60,
            app_version: packJson.version
        }
        logger.info('Constructed general backend service status data');
        return application;
    },

    compile(): IAppStatus {
        return this.getGeneralInfo();
    }
}

export {
    appStatus
};
