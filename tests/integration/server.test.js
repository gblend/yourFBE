const {tearDownTestConnection} = require('../helpers/connection_teardown');
const {connection} = require('mongoose');
const app = require('../../server');

describe('App', () => {
	afterAll( async () => {
		await tearDownTestConnection();
	});

	it('should successfully initialize app instance',() => {
		expect(Object.keys((connection.models)).length).toBeGreaterThan(0);
		expect(app).toBeDefined();
		expect(app.locals.settings.env).toEqual('test');
	});
});
