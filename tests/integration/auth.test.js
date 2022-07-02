const {tearDownTestConnection} = require('../helpers/connection_teardown');
const {connection} = require('mongoose');
const app = require('../../server');
const Joi = require('joi');
const request = require('supertest')(app);

describe('Auth', () => {
   let testUser, data = {};
   let loginTokens = [];

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

   it('should fail registration due to incomplete parameters', (done) => {

      request.post('/api/v1/auth/signup')
          .set('Content-Type', 'application/json')
          .send({})
          .expect(400)
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

   it('should successfully login a user with valid credentials', (done) => {

       data = {
           email:'test@example.com',
           password: 'password'
       }

      request.post('/api/v1/auth/login')
          .set('Content-Type', 'application/json')
          .send(data)
          .expect(200)
          .expect('Content-Type', 'application/json; charset=utf-8')
          .expect((response) => {
              loginTokens = response.headers['set-cookie'];

             const loggedInUser = Joi.object({
                status: testUser.status,
                message: Joi.string().required(),
                data: Joi.object({
                   verificationMsg: Joi.string().required(),
                   token: Joi.string().required(),
                   refreshToken: Joi.string().required(),
                   user: Joi.object(testUser.user)
                       .options({allowUnknown: true})
                })
             });

             Joi.assert(response.body, loggedInUser);


          }).end(done);
   });

    it('should fail to login with invalid parameters', (done) => {

        request.post('/api/v1/auth/login')
            .set('Content-Type', 'application/json')
            .send({})
            .expect(400)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect((response) => {

                const loginError = Joi.object({
                    status: Joi.string().required(),
                    message: Joi.string().required(),
                    data: Joi.object({
                        errors: Joi.array().min(1).required()
                    })
                });

                Joi.assert(response.body, loginError);


            }).end(done);
    });

    it('should fail to login with invalid email', (done) => {
        data = {
            email:'test@example1.com',
            password: 'password'
        }

        request.post('/api/v1/auth/login')
            .set('Content-Type', 'application/json')
            .send(data)
            .expect(400)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect((response) => {

                const loginError = Joi.object({
                    status: Joi.string().required(),
                    message: Joi.string().required(),
                    data: Joi.object({
                        errors: Joi.array().min(1).required()
                    })
                });

                Joi.assert(response.body, loginError);
            }).end(done);
    });

    it('should fail to login with invalid password', (done) => {
        data = {
            email:'test@example.com',
            password: 'password1'
        }

        request.post('/api/v1/auth/login')
            .set('Content-Type', 'application/json')
            .send(data)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(400)
            .expect((response) => {

                const loginError = Joi.object({
                    status: Joi.string().required(),
                    message: Joi.string().required(),
                    data: Joi.object({
                        errors: Joi.array().min(1).required()
                    })
                });

                Joi.assert(response.body, loginError);

            }).end(done);
    });
});
