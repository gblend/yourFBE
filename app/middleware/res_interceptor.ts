'use strict';

const {StatusCodes} = require('http-status-codes');

const resInterceptor = (_, res, next) => {
	const successMessage = 'Request processed successfully.';
	const errorMessage = 'Request failed.';

	let originJson = res.json;
	res.json = ({ data = {}, message = '' }) => {
		let statusCode = res.statusCode;
		const statusText = (![StatusCodes.OK, StatusCodes.NO_CONTENT, StatusCodes.CREATED].includes(statusCode)) ? 'error' : 'success';
		message = (!message && statusText === 'success') ? successMessage : message;
		message = (!message && statusText === 'error') ?  errorMessage : message;

		return originJson.call(res,{status: statusText, message, data});
	}

	next();
}

module.exports = resInterceptor;
