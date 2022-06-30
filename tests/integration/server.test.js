const {tearDownTestConnection} = require('../helpers/connection_teardown');

describe('App', () => {
	afterAll( async () => {
		await tearDownTestConnection();
	});
});
