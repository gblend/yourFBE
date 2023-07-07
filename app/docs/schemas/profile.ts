export default {
  ChangePasswordInput: {
    type: 'object',
    properties: {
      newPassword: {
        type: 'string',
        required: true,
        description: 'New password',
        example: 'xxx-xxx-xxx',
      },
      oldPassword: {
        type: 'string',
        required: true,
        description: 'Old password',
        example: '**********',
      },
    },
  },
  UpdateAccountInput: {
    type: 'object',
    properties: {
      firstname: {
        type: 'string',
        required: true,
        description: "User's firstname",
        example: 'John',
      },
      lastname: {
        type: 'string',
        required: true,
        description: "User's lastname",
        example: 'Doe',
      },
      email: {
        type: 'string',
        required: true,
        description: "User's email address",
        example: 'johndoe@example.com',
      },
    },
  },
};
