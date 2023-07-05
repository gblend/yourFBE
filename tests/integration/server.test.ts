import { tearDownTestConnection } from '../helpers/connection_teardown';
import { connection } from 'mongoose';
import { app } from '../../app';
import supertest from 'supertest';
const request = supertest(app);
import Joi from 'joi';

describe('App', () => {
  afterAll(async () => {
    await tearDownTestConnection();
  });

  it('should successfully initialize app instance', () => {
    expect(Object.keys(connection.models).length).toBeGreaterThan(0);
    expect(app).toBeDefined();
    expect(app.locals.settings.env).toEqual('test');
  });

  it('should return app status with registered routes', (done) => {
    request
      .get('/api/v1/status')
      .set('Content-Type', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect((response: any) => {
        const appStatusSchema = Joi.object({
          status: Joi.string().required(),
          message: Joi.string().required(),
          data: Joi.object({
            info: Joi.object({
              name: Joi.string().required(),
              node_version: Joi.string().required(),
              app_version: Joi.string().required(),
            }).options({ allowUnknown: true }),
            routes: Joi.array(),
          }),
        });

        Joi.assert(response.body, appStatusSchema);
      })
      .expect(200)
      .end(done);
  });
});
