export default {
  '/users/accounts/moderate/{id}': {
    delete: {
      tags: ['Admin'],
      description: 'Disable user account',
      summary: "Disable a user's account",
      operationId: 'disableAccount',
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          name: 'id',
          in: 'path',
          description: 'The user id to disable the account',
          type: 'string',
          example: '62e98a6859ce0b8e4fb59f32',
        },
      ],
      responses: {
        '200': {
          description: 'Disable account successful response',
          content: {
            'application/json': {
              example: {
                status: 'success',
                message: "John Does's account disabled successfully",
                data: {},
              },
            },
          },
        },
      },
    },
    patch: {
      tags: ['Admin'],
      description: 'Enable user account',
      summary: "Enable a user's disabled account",
      operationId: 'enableAccount',
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          name: 'id',
          in: 'path',
          description: 'The user id to enable the account',
          type: 'string',
          example: '62e98a6859ce0b8e4fb59f32',
        },
      ],
      responses: {
        '200': {
          description: 'Enable account successful response',
          content: {
            'application/json': {
              example: {
                status: 'success',
                message: "John Does's account enabled successfully",
                data: {},
              },
            },
          },
        },
      },
    },
  },
};
