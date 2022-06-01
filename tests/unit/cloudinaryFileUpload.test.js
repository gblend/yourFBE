'use strict';

const {uploadImage} = require('../../lib/utils/cloudinaryFileUpload');


describe('UploadImage', () => {
	it('should return error without file to upload', async() => {
		try {
			await uploadImage({});
		} catch (err) {
			expect(err.statusCode).toEqual(400);
			expect(typeof(err.message)).toBe('string');
			expect(err.message.length).toBeGreaterThan(0);
		}
	});

	it('should return error when file to upload is invalid', async () => {
		try {
			await uploadImage({files: {uploadImage: {mimetype: ''}}});
		} catch (err) {
			expect(err.statusCode).toEqual(400);
			expect(typeof(err.message)).toBe('string');
			expect(err.message.length).toBeGreaterThan(0);
		}
	});

	it('should return error when file to upload exceeds maximum size of 2mb (2097152)', async () => {
		try {
			await uploadImage({files: {uploadImage: {size: 3145728, mimetype: 'image/'}}});
		} catch (err) {
			expect(err.statusCode).toEqual(400);
			expect(typeof(err.message)).toBe('string');
			expect(err.message.length).toBeGreaterThan(0);
		}
	});
});
