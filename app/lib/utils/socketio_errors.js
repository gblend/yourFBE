module.exports.socketErrorText = (code) => {
	const errors = {
		0: 'Transport unknown',
		1: 'Session ID unknown',
		2: 'Bad handshake method',
		3: 'Bad request',
		4: 'Forbidden',
		5: 'Unsupported protocol version'
	}

	return errors[code];
}
