import {generateToken, attachCookiesToResponse, createJWT} from '../../app/lib/utils';

describe('AttachCookiesToResponse', () => {
	const cookie = (name: string, val: any, options: any): any => { return {name: val, options}};
	const mockResponse = () => {
		const res: any = {};
		res.cookie = jest.fn().mockImplementation(cookie);
		return res;
	};

	const token = generateToken();
	const user = {user: 'testUser', role: 'user', id: 'testId'};
	const accessTokenJWT = createJWT(user);
	const refreshTokenJWT = createJWT({user, refreshToken: token});

	it('with access token, null and res - res.cookie should be called twice', () => {
		const res = mockResponse();
		attachCookiesToResponse({accessTokenJWT, refreshTokenJWT: null, res});

		expect(res.cookie).toHaveBeenCalledTimes(2);
		expect(res.cookie).toBeCalledWith('accessToken', accessTokenJWT, expect.objectContaining({
			expires: expect.anything(),
			httpOnly: true,
			secure: expect.anything(),
			signed: true
		}));
		expect(res.cookie).toBeCalledWith('refreshToken', null, expect.objectContaining({
			expires: expect.anything(),
			httpOnly: true,
			secure: expect.anything(),
			signed: true
		}));
	});

	it('with access token, refresh token and res - res.cookie should be called twice', () => {
		const res = mockResponse();
		attachCookiesToResponse({accessTokenJWT, refreshTokenJWT, res});

		expect(res.cookie).toHaveBeenCalledTimes(2);
		expect(res.cookie).toBeCalledWith('accessToken', accessTokenJWT, expect.objectContaining({
			expires: expect.anything(),
			httpOnly: true,
			secure: expect.anything(),
			signed: true
		}));
		expect(res.cookie).toBeCalledWith('refreshToken', refreshTokenJWT, expect.objectContaining({
			expires: expect.anything(),
			httpOnly: true,
			secure: expect.anything(),
			signed: true
		}));
	});
});
