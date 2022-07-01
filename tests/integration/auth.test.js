const {tearDownTestConnection} = require('../helpers/connection_teardown');
const {connection} = require('mongoose');
const app = require('../../server');
const Joi = require('joi');
const {decrypt} = require('../../app/lib/utils');
const {User} = require('../../app/models/User');
const request = require('supertest')(app);

describe('Auth', () => {
   let testUser, data, socialProfile = {};
   let loginTokens = [];
   let verificationToken = '';

   beforeEach(() => {
       data = {
         firstname: 'Test',
         lastname: 'User',
         email:'test@example.com',
         password: 'password',
         passwordConfirmation: 'password'
      }
   });

   afterAll( async () => {
       await tearDownTestConnection();
   });

   it('should successfully register a user', (done) => {
      expect(Object.keys((connection.models)).length).toBeGreaterThan(0);

      request.post('/api/v1/auth/signup')
          .set('Content-Type', 'application/json')
          .send(data)
          .expect(200)
          .expect('Content-Type', 'application/json; charset=utf-8')
          .expect((response) => {
             testUser = response.body;

             const registeredUser = Joi.object({
                status: Joi.string().required(),
                message: Joi.string().required(),
                data: Joi.object({
                   token: Joi.string().required(),
                   refreshToken: Joi.string().required(),
                   user: Joi.object({
                      firstname: data.firstname,
                      lastname: data.lastname,
                      email: data.email,
                      role: Joi.string().required(),
                      gender: Joi.string().required(),
                      status: Joi.string().required(),
                      avatar: Joi.string().required(),
                      verificationToken: Joi.string().required(),
                      isVerified: Joi.boolean().required(),
                      createdAt: Joi.date().required(),
                      updatedAt: Joi.date().required()
                   }).options({allowUnknown: true})
                })
             });

             Joi.assert(response.body, registeredUser);

          }).end(done);
   });

   it('should fail registration due to duplicate email', (done) => {

      request.post('/api/v1/auth/signup')
          .set('Content-Type', 'application/json')
          .send(data)
          .expect(500)
          .expect('Content-Type', 'application/json; charset=utf-8')
          .expect((res) => {

             const registrationError = Joi.object({
                status: Joi.string().required(),
                message: Joi.string().required(),
                data: Joi.object({
                   errors: Joi.array().min(1).required()
                })
             });

             Joi.assert(res.body, registrationError);

          }).end(done);
   });
});
