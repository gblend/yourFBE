import {createJWT} from '../../app/lib/utils';

describe('CreateJWT', () => {
	const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiR2FicmllbCBDLiBJbG9jaGkiLCJpZCI6IjYyYTA3NzY4ZDk2OWYw' +
		'N2NjYzNiMTY5OCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjU1NjgwOTgzfQ.JaDingQIfQs9Qg46hsk91K4RKaw-27eJXDzzAXHe7TM';

	it('should return created JWT string token when payload is provided', () => {
		const generatedToken = createJWT({name: 'Test', role: 'user', id: token});
		expect(typeof (generatedToken)).toBe('string');
		expect(generatedToken.length).toBeGreaterThan(0);
	});

});
