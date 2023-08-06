export const constants = {
  auth: {
    INVALID_CREDENTIALS: (fault: string = 'credentials provided') =>
      `Invalid ${fault}.`,
    ALREADY_IN_USE: (property: string): string =>
      `${property} is already in use.`,
    AUTHENTICATION_INVALID: 'Authentication invalid.',
    SUCCESSFUL: (action: string): string => `${action} successful.`,
  },
  STATUS_ENABLED: 'enabled',
  STATUS_DISABLED: 'disabled',
  role: {
    ADMIN: 'admin',
    USER: 'user',
  },
};
