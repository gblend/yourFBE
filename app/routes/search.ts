import { Router } from 'express';
import { search } from '../controllers';

const router = Router();

router.route('/').post(search);

export default router;
