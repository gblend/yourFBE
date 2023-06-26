import partials from '../partials';

export default {
    '/search': {
        post: {
            tags: ['Search'],
            description: 'Search for feed, category',
            summary: 'search category, feed',
            operationId: 'search',
            security: [{
                bearerAuth: []
            }],
            parameters: [
                {
                    name: 'pageNumber',
                    in: 'query',
                    description: 'Page number of users list',
                    type: 'number',
                    example: 1
                },
                {
                    name: 'pageSize',
                    in: 'query',
                    description: 'The number of records to be retrieved',
                    type: 'number',
                    example: 10
                },
                {
                    name: 'sort',
                    in: 'query',
                    description: 'The fields to sort the document by',
                    type: 'string',
                    example: 'description'
                }
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                searchTerm: {
                                    type: 'string',
                                    required: true,
                                    example: 'apology'
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                '200': {
                    description: 'Search category, feed successful response',
                    content: {
                        'application/json': {
                            example: {
                                status: 'success',
                                message: 'Search results retrieved successfully',
                                data: {
                                    result: [
                                        {
                                            _id: '62b475ba6f14165de5a7cff3',
                                            name: 'Technology',
                                            description: 'All things technology and technology related feeds category',
                                            id: '62b475ba6f14165de5a7cff3'
                                        },
                                        {
                                            _id: '62ee9b5c9322443c8b3027be',
                                            name: 'Cycling',
                                            description: 'Category for all feeds related to cycling',
                                            id: '62ee9b5c9322443c8b3027be'
                                        },
                                        {
                                            _id: '62b475c46f14165de5a7cff7',
                                            name: 'Education',
                                            description: 'Category for all feeds related to education',
                                            id: '62b475c46f14165de5a7cff7'
                                        },
                                        {
                                            _id: '62b475d26f14165de5a7cfff',
                                            name: 'Entertainment',
                                            description: 'Category for all feeds related to entertainment',
                                            id: '62b475d26f14165de5a7cfff'
                                        },
                                        {
                                            _id: '62b84eb7efa9cfbb3f354870',
                                            name: 'Music',
                                            description: 'Category for all feeds related to music',
                                            id: '62b84eb7efa9cfbb3f354870'
                                        },
                                        {
                                            _id: '62b475cc6f14165de5a7cffb',
                                            name: 'Sports',
                                            description: 'Category for all feeds related to sports',
                                            id: '62b475cc6f14165de5a7cffb'
                                        }
                                    ],
                                    pagination: partials.pagination
                                }
                            }
                        }
                    }
                },
                '404': {
                    description: 'No search result found',
                    content: {
                        'application/json': {
                            example: {
                                status: 'error',
                                message: 'No result found',
                            }
                        }
                    }
                }
            }
        }
    }
}