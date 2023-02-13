const mockIoredis =  require('ioredis-mock');
jest.mock('ioredis', () => mockIoredis);
