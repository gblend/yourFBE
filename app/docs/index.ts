import schemas from './schemas';
import paths from './paths';
import generalSetup from './general';

export default {
    ...generalSetup,
    components: {
        securitySchemes: {
            cookieAuth: {
                type: 'apiKey',
                in: 'cookie',
                name: 'accessToken',
            },
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            }
        },
        ...schemas,
        headers: {
            contentType: 'application/json',
            accept: 'application/json'
        }
    },
    ...paths,
}
