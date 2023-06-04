import {Router} from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../docs';

const router = Router();

const options = {
    explorer: false,
    customCssUrl: '/css/custom_swagger_style.css'
}
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));

export default router;
