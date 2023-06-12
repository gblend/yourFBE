import partials from '../../partials';

export default {
    '/notifications': {
        post: {
            tags: ['Notifications'],
            description: 'Create notification',
            summary: 'create a new notification',
            operationId: 'createNotification',
            security: [{
                bearerAuth: []
            }],
            requestBody: {
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                title: {
                                    type: 'string',
                                    required: true,
                                    example: 'New notification'
                                },
                                text: {
                                    type: 'string',
                                    required: true,
                                    example: 'This is a new notification'
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                '200': {
                    description: 'Create notification successful response',
                    content: {
                        'application/json': {
                            example: {
                                status: 'success',
                                message: 'Notification created and sent successfully.',
                                data: {
                                    notification: {
                                        _id: '63dff2ecef4ab7fb65f48896',
                                        text: 'Some other text',
                                        title: 'Some Notification',
                                        __v: 0,
                                        createdAt: '2023-02-05T18:18:19.979Z',
                                        status: 'enabled',
                                        updatedAt: '2023-02-05T21:36:14.850Z'
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        get: {
            tags: ['Notifications'],
            description: 'Get notifications',
            summary: 'retrieve available notifications',
            operationId: 'getNotifications',
            security: [{
                bearerAuth: []
            }],
            parameters: [
                {
                    name: 'pageNumber',
                    in: 'query',
                    description: 'Page number of notification list',
                    type: 'number',
                    example: 1
                },
                {
                    name: 'pageSize',
                    in: 'query',
                    description: 'The number of records to be retrieved',
                    type: 'number',
                    example: 10
                }
            ],
            responses: {
                '200': {
                    description: 'Get notifications successful response',
                    content: {
                        'application/json': {
                            example: {
                                status: 'success',
                                message: 'Notifications fetched successfully.',
                                data: {
                                    notifications: [
                                        {
                                            _id: '63dff2ecef4ab7fb65f48896',
                                            text: 'Some other text',
                                            title: 'Some Notification',
                                            createdAt: '2023-02-05T18:18:19.979Z'
                                        },
                                        {
                                            _id: '63dfc3c5ef4ab7fb65d30791',
                                            text: 'Another text',
                                            title: 'Notification title',
                                            createdAt: '2023-02-05T14:57:08.585Z'
                                        },
                                    ],
                                    pagination: partials.pagination
                                }
                            }
                        }
                    }
                },
                '404': {
                    description: 'Notifications not found response',
                    content: {
                        'application/json': {
                            example: {
                                status: 'success',
                                message: 'No notification found',
                                data: {}
                            }
                        }
                    }
                }
            }
        }
    },
    '/notifications/{id}': {
        delete: {
            tags: ['Notifications'],
            description: 'Delete notification',
            summary: 'deletes a notification',
            operationId: 'deleteNotification',
            security: [{
                bearerAuth: []
            }],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    description: 'Notification id',
                    required: true,
                    type: 'string',
                    example: '63def1adef4ab7fb65477f7d'
                }
            ],
            responses: {
                '200': {
                    description: 'Delete notification successful response',
                    content: {
                        'application/json': {
                            example: {
                                status: 'success',
                                message: 'Notification deleted successfully.',
                                data: {}
                            }
                        }
                    }
                }
            }
        },
        patch: {
            tags: ['Notifications'],
            description: 'Update notification',
            summary: 'update a notification',
            operationId: 'updateNotification',
            security: [{
                bearerAuth: []
            }],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    description: 'Notification id',
                    required: true,
                    type: 'string',
                    example: '63def1adef4ab7fb65477f7d'
                }
            ],
            requestBody: {
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                status: {
                                    type: 'string',
                                    example: 'enabled'
                                },
                                title: {
                                    type: 'string',
                                    example: 'Updated notification'
                                },
                                text: {
                                    type: 'string',
                                    example: 'This is an updated notification'
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                '200': {
                    description: 'Notification update successful response',
                    content: {
                        'application/json': {
                            example: {
                                status: 'success',
                                message: 'Notifications updated successfully.',
                                data: {}
                            }
                        }
                    }
                },
                '400': {
                    description: 'Notifications update error response',
                    content: {
                        'application/json': {
                            example: {
                                status: 'error',
                                message: 'Notification not found for update',
                                data: {}
                            }
                        }
                    }
                }
            }
        }
    }
}
