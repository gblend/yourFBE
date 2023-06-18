import {uploadImage, uploadToCloudinary, uploadToLocal} from '../../app/lib/utils/cloud_assets';
const cloudHelpers: any = {uploadImage, uploadToCloudinary, uploadToLocal};
const defaultAvatarUrl = 'http://localhost/upload/avatar.jpg';

describe('UploadImage', () => {
	it('should return error without file to upload', async() => {
		try {
			await uploadImage('');
		} catch (err: any) {
			expect(err.statusCode).toEqual(400);
			expect(typeof(err.message)).toBe('string');
			expect(err.message.length).toBeGreaterThan(0);
		}
	});

	it('should return error when file to upload is invalid', async () => {
		try {
			await uploadImage({uploadImage: {mimetype: ''}});
		} catch (err: any) {
			expect(err.statusCode).toEqual(400);
			expect(typeof(err.message)).toBe('string');
			expect(err.message.length).toBeGreaterThan(0);
		}
	});

	it('should return error when file to upload exceeds maximum size of 2mb (2097152)', async () => {
		try {
			await uploadImage({uploadImage: {size: 3145728, mimetype: 'image/'}});
		} catch (err: any) {
			expect(err.statusCode).toEqual(400);
			expect(typeof(err.message)).toBe('string');
			expect(err.message.length).toBeGreaterThan(0);
		}
	});

	it('should succeed when valid file is uploaded - cloudinary', async () => {
		const req = {files: {uploadImage: {size: 1024, mimetype: 'image/'}}, uploadType: 'cloudinary'};
		const cloudinaryImageUploadSpy = jest.spyOn(cloudHelpers, 'uploadToCloudinary');

		cloudinaryImageUploadSpy.mockImplementation((imageFile: any, uploadType) =>
			Promise.resolve({url: defaultAvatarUrl}));
		await cloudHelpers.uploadToCloudinary(req.files.uploadImage, req.uploadType);

		expect(cloudinaryImageUploadSpy).toHaveBeenCalledTimes(1);
		expect(cloudinaryImageUploadSpy).toHaveBeenCalledWith(req.files.uploadImage, req.uploadType);
	});

	it('should succeed when valid file is uploaded - local', async () => {
		const req = {files: {uploadImage: {size: 1024, mimetype: 'image/'}}, uploadType: 'local'};
		const imageUploadSpy = jest.spyOn(cloudHelpers, 'uploadImage');

		imageUploadSpy.mockImplementation(async (file: any, type: any) =>
			Promise.resolve({url: defaultAvatarUrl}));
		await cloudHelpers.uploadImage(req.files, req.uploadType);

		expect(imageUploadSpy).toHaveBeenCalledTimes(1);
		expect(imageUploadSpy).toHaveBeenCalledWith(req.files, req.uploadType);
	});

	it('should upload image to local storage ', async () => {
		const req = {files: {uploadImage: {size: 1024, mimetype: 'image/'}}};
		const localImageUploadSpy = jest.spyOn(cloudHelpers, 'uploadToLocal');

		localImageUploadSpy.mockImplementation((imageFile: any) =>
			Promise.resolve({url: defaultAvatarUrl}));
		await cloudHelpers.uploadToLocal(req.files.uploadImage);

		expect(localImageUploadSpy).toHaveBeenCalledTimes(1);
		expect(localImageUploadSpy).toHaveBeenCalledWith(req.files.uploadImage);
	});

});
