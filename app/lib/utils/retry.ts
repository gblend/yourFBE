import retry, {RetryOperation} from 'retry';
import * as https from 'https';
import * as http from 'http';
import {logger} from './logger';

export const request = ({_id: feedId = '', method = 'GET', url: webAddress}: { _id?: string, method?: string, url: string },
                        cb: (data: any, feedId?: string) => any): boolean => {
    const {requestUrl: url, requestProtocol: protocol} = formatUrlProtocol(webAddress);

    const operation: RetryOperation = retry.operation({
        retries: 3,
        factor: 2,
        minTimeout: 2000,
        maxTimeout: 15 * 1000,
        randomize: true,
    });
    let isSuccessful = false;

    operation.attempt((): Promise<any> => {
        return new Promise((resolve, reject): void => {
            let body: any = '';
            switch (method) {
                case 'GET':
                    protocol.get(url, (res: any) => {
                        const statusCode: number = res.statusCode as number;

                        if (statusCode === 200) {
                            res.on('data', (chunk: any) => body += chunk.toString());
                            res.on('end', (): any => {
                                resolve(cb(body, feedId));
                            });
                        }

                        if (statusCode === 301) {
                            const newUrl: string = res.headers.location!;
                            return request({_id: feedId, url: newUrl}, cb)
                        }
                    }).on('error', (err: Error): void => {
                        if (operation.retry(err)) {
                            return;
                        }
                        reject(err ? operation.mainError() : null)
                    }).end();

                    break;
                case 'POST':
                case 'PUT':
                default:
                    reject('Method not implemented');
            }
        }).then((_success: any) => {
            isSuccessful = true;
        }).catch((err: any) => {
            isSuccessful = false;
            logger.error(`Request to ${url} failed, ${err}`)
        });
    });

    return isSuccessful;
}

export const formatUrlProtocol = (url: string): { requestUrl: string, requestProtocol: any } => {
    let requestProtocol: any = url.indexOf('http://') !== 0 ? https : http;
    if (url.indexOf('https://') !== 0 && url.indexOf('http://')) {
        url = `https://${url}`;
        requestProtocol = https;
    }
    return {requestUrl: url, requestProtocol}
}