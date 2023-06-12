import adminDashboard from './me';
import starredFeedsPostsStat from './starred_feeds_posts_stat';
import adminUpdateAccount from './update_account';
import userDetails from './user_detail';
import followedFeedStat from './followed_feeds_stat';
import users from './users';

export default {
    ...adminDashboard,
    ...starredFeedsPostsStat,
    ...adminUpdateAccount,
    ...userDetails,
    ...users,
    ...followedFeedStat,
}