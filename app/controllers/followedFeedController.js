'use strict';

const {StatusCodes} = require('http-status-codes');
const {adaptRequest, formatValidationError, logger, createObjectId,
	} = require('../lib/utils');
const {FollowedFeed, validateFollowedFeedDto} = require('../models/FollowedFeed');
const {BadRequestError} = require('../lib/errors');

const followFeed = async (req, res) => {
	const {body, method, path, user} = adaptRequest(req);
	body.user = createObjectId(user.id);
	body.feed = createObjectId(body.feed);

	const {error} = validateFollowedFeedDto(body);
	if (error) {
		return res.status(StatusCodes.BAD_REQUEST).json({data: {errors: formatValidationError(error)}});
	}

	const isFollowed = await FollowedFeed.findOne(body);
	let followedFeed = {}
	if (!isFollowed) {
		followedFeed = await FollowedFeed.create(body);
		if (!Object.keys(followedFeed).length) {
			throw new BadRequestError(`Unable to follow feed. Please try again later.`);
		}
		logger.info(`${StatusCodes.OK} - Followed feed ${body.feed} successfully - ${method} ${path}`);
	}

	res.status(StatusCodes.CREATED).json({message: 'Feed followed successfully.', data: {followedFeed}});
}

module.exports = {
	followFeed
}
