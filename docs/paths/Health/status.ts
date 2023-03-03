export default {
    '/status': {
        get: {
            tags: ['Backend Health Operations'],
            description: 'Get backend service status',
            operationId: 'getHealthStatus',
            parameters:[],
            responses: {
                200: {
                    description: 'Backend service status returned successfully',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/HealthStatus',
                            },
                        },
                    },
                },
            },
        },
    }
}
