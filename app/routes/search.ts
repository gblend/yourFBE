import {Router} from 'express';
const router = Router();
import {search} from '../controllers/searchController';

router.route('/').post(search);

export default router;
