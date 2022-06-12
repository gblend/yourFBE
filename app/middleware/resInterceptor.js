'use strict';

const {StatusCodes} = require('http-status-codes');

const resInterceptor = (_req, res, next) => {
	const successMessage = 'Request processed successfully.';
	const errorMessage = 'Request failed.';

	let originJson = res.json;
	res.json = ({ data = {}, message = '' }) => {
		let statusCode = res.statusCode;
		data = (!data || Object.keys(data).length === 0) ? {} : data;
		const statusText = (![StatusCodes.OK, StatusCodes.NO_CONTENT, StatusCodes.CREATED].includes(statusCode)) ? 'error' : 'success';
		message = (message.length < 1 && statusText === 'success') ? successMessage : message;
		message = (message.length < 1 && statusText === 'error') ?  errorMessage : message;

		return originJson.call(res,{status: statusText, message, data});
	}

	next();
}

module.exports = resInterceptor;
