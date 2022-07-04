const {parseString} = require('xml2js');
const https = require('https');

async function fetchFeedPosts (url) {
	const protocol = url.indexOf('http://') !== 0 ? https : require('http');
	return new Promise((resolve, reject) => {
		protocol.get(url, (response) => {
			const statusCode = response.statusCode;

			if (statusCode === 200) {
				let data = '';
				response.on('data', (chunk) => data += chunk.toString());
				response.on('end', () => {
					parseString(data, {mergeAttrs: true}, (error, result) => {
						if (error) return reject(error);
						return resolve(result.rss.channel[0]);
					});
				});
			}

			if (statusCode === 301) {
				const newUrl = response.headers['location'];
				return resolve(fetchFeedPosts(newUrl))
			}
		}).on('error', (error) => reject(error)).end();
	});
}

module.exports = {
	fetchFeedPosts
}