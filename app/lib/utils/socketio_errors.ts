const socketErrorText = (code: number): string => {
	const errors: string[] = [
		'Transport unknown',
		'Session ID unknown',
		'Bad handshake method',
		'Bad request',
		'Forbidden',
		'Unsupported protocol version'
	]

	if (code < errors.length) {
		return errors[code];
	}

	return '';
}

export {
	socketErrorText
}
