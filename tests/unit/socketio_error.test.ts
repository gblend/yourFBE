import {socketErrorText} from '../../app/lib/utils/socketio_errors';

describe('SocketErrorText', () => {
    it('should return text for passed error code', () => {
        const text: string = socketErrorText(1);

        expect(text).toBe('Session ID unknown');
    });

    it('should return empty string when out of range code is passed', () => {
        const text: string = socketErrorText(6);

        expect(text).toBe('');
    });
});
