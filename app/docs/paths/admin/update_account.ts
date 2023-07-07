import partials from '../partials';

export default {
  '/users/update/{id}': {
    patch: {
      tags: ['Admin'],
      description: 'Update account',
      summary: 'update account information',
      operationId: 'updateAccount',
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          name: 'id',
          in: 'path',
          description: 'User id',
          required: true,
          type: 'string',
          example: '63d99f09b014d76af46123f0',
        },
      ],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/UpdateAccountInput',
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Update account successful response',
          content: {
            'application/json': {
              example: {
                status: 'success',
                message: 'Information updated successfully',
                data: {
                  token:
                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiR2FicmllbCBJbG9jaGkiLCJpZCI6IjYyYWZhZGRiNzFhZTA2NTMzMDc5OGVkMCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjU1NjgwNDc2fQ.RcORvSx7NWFKIcs4bD6tt21r0v0J3movo3b2XUAEgno',
                  user: partials.authUser,
                },
              },
            },
          },
        },
        '404': {
          description: 'Update account failed response',
          content: {
            'application/json': {
              example: {
                status: 'error',
                message: 'Request failed.',
                data: {
                  errors: ['User with id: 62a07768d969f07ccc3b169 not found'],
                },
              },
            },
          },
        },
      },
    },
  },
};
