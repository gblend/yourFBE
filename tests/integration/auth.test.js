const {tearDownTestConnection} = require('../helpers/connection_teardown');
const app = require('../../server');

describe('Auth', () => {
   let data = {};

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

});
