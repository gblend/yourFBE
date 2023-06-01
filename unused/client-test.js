const io = require('socket.io-client');

function checkSocketIoConnect(url, timeout = 5000, token =  '') {
	return new Promise(function(resolve, reject) {
		let errAlready = false;
		timeout = timeout || 5000;
		let socket = io(url, {reconnection: true, timeout: timeout, auth: {token}, withCredentials: true});

		// success
		socket.on("connect", function() {
			clearTimeout(timer);
			resolve();
		});

		socket.on('connected', (response) => {
			console.log('--------------------------------------');
			console.log(response.message);
		});


		socket.on('feed:created', (response) => {
			console.log('----------------feed:created----------------------');
			console.log(response);
		});

		socket.on('notification:generated', (response) => {
			console.log('----------------notification:generated----------------------');
			console.log(response);
		});
		socket.on('notification:deleted', (response) => {
			console.log('----------------notification:deleted----------------------');
			console.log(response);
		});
		socket.on('notification:updated', (response) => {
			console.log('----------------notification:updated----------------------');
			console.log(response);
		});

		// set our own timeout in case the socket ends some other way than what we are listening for
		let timer = setTimeout(function() {
			timer = null;
			error("local timeout");
		}, timeout);

		// common error handler
		function error(data) {
			console.log('--------------------------------------');
			console.log(data.message);
			if (timer) {
				clearTimeout(timer);
				timer = null;
			}
			if (!errAlready) {
				errAlready = true;
				reject(data);
				socket.disconnect();
			}
		}

		// errors
		socket.on("connect_error", error);
		socket.on("connect_timeout", error);
		socket.on("error", error);
		socket.on("disconnect", error);

	});
}

// checkSocketIoConnect("http://localhost:5000").then(function(response) {
// 	console.log('Connection request sent.');
// 	// succeeded here
// }, function(reason) {
// 	// failed here
// 	console.log(reason);
// });

checkSocketIoConnect("http://localhost:5000/auth-user", 5000, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiR2FicmllbCBJbG9jaGkiLCJpZCI6IjYzMDJhMGE4ZTIwNDFkYjJmNTlkNjU5OCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY2MTExNjYyOH0.-vX-0d-raWshWBpzJR50gKneYeNzEspAwZ6lmfqufRQ').then(function(response) {
	console.log('auth 1 connection request sent.');
	// succeeded here
}, function(reason) {
	// failed here
	console.log(reason);
});


checkSocketIoConnect("http://localhost:5000/auth-user", 5000, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiVGVzdCBmaXJzdCBuYW1lIFRlc3QgbGFzdCBuYW1lIiwiaWQiOiI2M2RmYWY4YWVmNGFiN2ZiNjVjNGZiODEiLCJyb2xlIjoidXNlciIsImlhdCI6MTY3NTYwMzg0OX0.bCSeS140Wpcgw2OQV_QQEn5tuW9e0cY1zSDD0dwdBnU').then(function(response) {
	console.log('auth 2 connection request sent.');
	// succeeded here
}, function(reason) {
	// failed here
	console.log(reason);
});
