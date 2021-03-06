'use strict';

const amqp = require('amqplib');
const CustomError = require('../errors');
const {sendVerificationEmail, sendResetPasswordEmail} = require('./index');
const {config} = require('../../config/config');

let channel = '', connection = '';

const initAmqpServer = async () => {
    const amqpServer = `amqp://${config.amqp.host}:${config.amqp.port}`;
    if (!connection) {
        return amqp.connect(amqpServer);
    }
    return connection;
}

const createAmqpChannel = async (queue) => {
    connection = await initAmqpServer();
    channel = await connection.createChannel();
    channel.assertExchange(queue, 'direct', {durable: true});
    await channel.assertQueue(queue);
    return {channel}
}

const pushToQueue = async (queue, queueErrorMsg, data) => {
    const {channel: amqpChannel} = await createAmqpChannel(queue);
    /*
    The empty string as third parameter means that we don't want to send the message to any specific queue (routingKey).
    We want only to publish it to our exchange
    The parameters -- exchange, routingKey, content
    amqpChannel.publish(queue, queue.toLowerCase(), Buffer.from(JSON.stringify({ [queue]: data })));
    */
    const queueData = await amqpChannel.sendToQueue(queue, Buffer.from(JSON.stringify({[queue]: data})));
    if (!queueData) {
        throw new CustomError.BadRequestError(queueErrorMsg);
    }
    await execConsumeQueues();
}

const initConsumeQueue = async (fn, queue) => {
    const {channel: ch} = await createAmqpChannel(queue);
    ch.assertExchange(queue, 'direct', {durable: true});
    // The parameters -- queue, exchange, bindingKey
    ch.bindQueue(queue, queue, queue.toLowerCase());
    ch.consume(queue, async (data) => {
        let queuePayload = JSON.parse(data.content);
        await fn(queuePayload[queue]);
        ch.ack(data)
    })
}

const execConsumeQueues = async () => {
    await initConsumeQueue(sendVerificationEmail, config.amqp.verifyEmailQueue);
    await initConsumeQueue(sendResetPasswordEmail, config.amqp.resetEmailQueue);
}

module.exports = {
    pushToQueue,
}
