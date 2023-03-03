import {Router} from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../docs';

const router = Router();
const options = {
    explorer: true
};

router.use('/api/docs', swaggerUi.serve);
router.route('/api/docs').get(swaggerUi.setup(swaggerDocument, options));

export default router;
