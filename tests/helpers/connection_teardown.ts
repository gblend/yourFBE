import {connection, disconnect} from 'mongoose';
import {pubClient, subClient} from '../../app/socket';

const tearDownTestConnection = async (): Promise<void> => {
	if (connection.readyState === 1) {
		const collections = await connection.db.listCollections().toArray() ?? [];
		for (const key in collections) {
			if (collections[key]) await connection.dropCollection(`${collections[key].name}`)
		}
		await connection.dropDatabase();
	}

	await connection.close(true);
	await disconnect();
	pubClient.disconnect();
	subClient.disconnect();
}

export {
	tearDownTestConnection
}
