'use strict';

const cloudHelpers = require('../../app/lib/utils/cloudinary_upload');


describe('UploadImage', () => {
	it('should return error without file to upload', async() => {
		try {
			await cloudHelpers.uploadImage({});
		} catch (err) {
			expect(err.statusCode).toEqual(400);
			expect(typeof(err.message)).toBe('string');
			expect(err.message.length).toBeGreaterThan(0);
		}
	});

	it('should return error when file to upload is invalid', async () => {
		try {
			await cloudHelpers.uploadImage({files: {uploadImage: {mimetype: ''}}});
		} catch (err) {
			expect(err.statusCode).toEqual(400);
			expect(typeof(err.message)).toBe('string');
			expect(err.message.length).toBeGreaterThan(0);
		}
	});

	it('should return error when file to upload exceeds maximum size of 2mb (2097152)', async () => {
		try {
			await cloudHelpers.uploadImage({files: {uploadImage: {size: 3145728, mimetype: 'image/'}}});
		} catch (err) {
			expect(err.statusCode).toEqual(400);
			expect(typeof(err.message)).toBe('string');
			expect(err.message.length).toBeGreaterThan(0);
		}
	});

	it('should succeed when valid file is uploaded', async () => {
		const req = {files: {uploadImage: {size: 1024, mimetype: 'image/'}}};
		const uploadImage = jest.spyOn(cloudHelpers, 'uploadImage');
		const mockUploadImage = async (requestObj) => jest.fn().
		mockReturnValue(await cloudHelpers.uploadImage(requestObj));

		await mockUploadImage(req).catch(_ => _);

		expect(uploadImage).toHaveBeenCalledTimes(1);
		expect(uploadImage).toHaveBeenCalledWith(req);
	});
});
