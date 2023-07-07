export default {
  '/users/upload/image': {
    post: {
      tags: ['Profile'],
      description: 'Upload profile image',
      summary: 'uploads profile image',
      operationId: 'uploadProfileImage',
      security: [
        {
          bearerAuth: [],
        },
      ],
      requestBody: {
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              properties: {
                uploadImage: {
                  type: 'string',
                  format: 'binary',
                  required: true,
                },
                uploadType: {
                  type: 'string',
                  example: 'local',
                },
              },
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Upload profile image successful response',
          content: {
            'application/json': {
              example: {
                status: 'success',
                message: 'Profile image uploaded successfully',
                data: {
                  imageUrl: '/uploads/example.png',
                },
              },
            },
          },
        },
        '400': {
          description: 'Upload profile image failed response',
          content: {
            'application/json': {
              example: {
                status: 'error',
                message: 'Request failed.',
                data: {
                  errors: ['No file uploaded'],
                },
              },
            },
          },
        },
      },
    },
  },
};
