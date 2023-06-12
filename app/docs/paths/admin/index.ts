import adminDashboard from './me';
import starredFeedsPostsStat from './starred_feeds_posts_stat';
import adminUpdateAccount from './update_account';
import userDetails from './user_detail';
import followedFeedStat from './followed_feeds_stat';
import moderateUserAccount from './moderate_account';
import disabledAccounts from './disabled_accounts';
import changePassword from './change_password';
import users from './users';
import notifications from './notifications';

export default {
    ...adminDashboard,
    ...starredFeedsPostsStat,
    ...adminUpdateAccount,
    ...userDetails,
    ...users,
    ...followedFeedStat,
    ...moderateUserAccount,
    ...disabledAccounts,
    ...changePassword,
    ...notifications,
}