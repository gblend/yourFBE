import {Router} from 'express';
import {randomFeedsPosts, recentFeedPosts,} from '../controllers';

const router: Router = Router();


router.route('/').get(randomFeedsPosts);
router.route('/recent').get(recentFeedPosts);

export default router;
