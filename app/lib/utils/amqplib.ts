import amqp from 'amqplib';
import {BadRequestError} from '../errors';
import mailer from './email/sendEmail';
const sendVerificationEmail: Function = mailer.sendVerificationEmail;
const sendResetPasswordEmail: Function = mailer.sendResetPasswordEmail;
import {config} from '../../config/config';

let channel: any = ''; let connection : any = '';

const initAmqpServer = async (): Promise<amqp.Connection> => {
    const amqpServer = 'amqp://127.0.0.1:5672';
    if (!connection) {
        return amqp.connect(amqpServer);
    }
    return connection;
}

const createAmqpChannel = async (queue: string): Promise<{channel: amqp.Channel}> => {
    connection = await initAmqpServer();
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
    await execConsumeQueues();
}

const initConsumeQueue = async (fn: Function, queue: string): Promise<void> => {
    const {channel: ch} = await createAmqpChannel(queue);
    await ch.assertExchange(queue, 'direct', {durable: true});
    // the parameters -- queue, exchange, bindingKey
    await ch.bindQueue(queue, queue, queue.toLowerCase());
    await ch.consume(queue, async (data: any) => {
        let queuePayload = JSON.parse(data.content);
        await fn(queuePayload[queue]);
        ch.ack(data)
    })
}

const execConsumeQueues = async () => {
    await initConsumeQueue(sendVerificationEmail, config.amqp.verifyEmailQueue);
    await initConsumeQueue(sendResetPasswordEmail, config.amqp.resetEmailQueue);
}

export {
    pushToQueue,
}
