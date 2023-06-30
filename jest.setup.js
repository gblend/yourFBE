jest.mock('ioredis', () => require('ioredis-mock'));

jest.mock('amqplib', () =>  require('mock-amqplib'));

jest.setTimeout(20000);