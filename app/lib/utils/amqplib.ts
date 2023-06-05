import amqp from 'amqplib';
import {BadRequestError} from '../errors';
import {config} from '../../config/config';
import {logger} from './logger';

let channel: any = '';
let connection: any = '';

const initAmqpServer = async (): Promise<amqp.Connection> => {
    if (!connection) {
        return amqp.connect({
                hostname: config.amqp.host,
                port: config.amqp.port,
                heartbeat: 60,
            },
            {prefetch: 1});
    }
    return connection;
}

const createAmqpChannel = async (queue: string): Promise<{ channel: amqp.Channel }> => {
    connection = await initAmqpServer()
        .then<amqp.Connection, never>((conn: amqp.Connection) => conn)
        .catch((error: any) => logger.error(`AMQP connection error: ${error}`));
    channel = await connection.createChannel();
    await channel.assertExchange(queue, 'direct', {durable: true});
    await channel.assertQueue(queue);
    return {channel}
}

const pushToQueue = async (queue: string, queueErrorMsg: string, data: any) => {
    const {channel: amqpChannel} = await createAmqpChannel(queue);
    /*
    The empty string as third parameter means that we don't want to send the message to any specific queue (routingKey).
    We want only to publish it to our exchange
    The parameters -- exchange, routingKey, content
    amqpChannel.publish(queue, queue.toLowerCase(), Buffer.from(JSON.stringify({ [queue]: data })));
    */
    const queueData: boolean = amqpChannel.sendToQueue(queue, Buffer.from(JSON.stringify({[queue]: data})));
    if (!queueData) {
        throw new BadRequestError(queueErrorMsg);
    }
}

const initConsumer = async (fn: (payload: any) => void, queue: string): Promise<void> => {
    const {channel: ch} = await createAmqpChannel(queue);
    await ch.assertExchange(queue, 'direct', {durable: true});
    // the parameters -- queue, exchange, bindingKey
    await ch.bindQueue(queue, queue, queue.toLowerCase());
    await ch.consume(queue, async (data: any) => {
        const queuePayload = JSON.parse(data.content);
        await fn(queuePayload[queue]);
        ch.ack(data)
    })
}

export {
    pushToQueue,
    initConsumer,
}
