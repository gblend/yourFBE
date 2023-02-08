import {checkPermissions} from '../../app/lib/utils';
import mongoose from 'mongoose';

describe('CheckPermission', () => {
	const resourceUserId = new mongoose.Types.ObjectId();
	const reqUser = { name: 'Test User', id: resourceUserId.toHexString(), role: 'user' };

	it('should  return unauthorized access with invalid resource user id', () => {
		expect(() => checkPermissions(reqUser, 2)).toThrow()
	});

	it('should return true with valid resource user id', () => {

		expect(checkPermissions(reqUser, resourceUserId)).toStrictEqual(true);
	});
});
