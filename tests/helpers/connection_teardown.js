const {connection, disconnect} =  require('mongoose');

exports.tearDownTestConnection = async () => {
	if (connection.readyState === 1) {
		const collections = await connection.db.listCollections().toArray() ?? [];
		for (const key in collections) {
			const collection = collections[key];
			await connection.dropCollection(`${collection?.name}`)
		}
		await connection.dropDatabase();
	}

	await connection.close(true);
	await disconnect();
}
