import supertest from 'supertest';
import { app } from '../app';
import { describe, expect } from '@jest/globals';
import { bioTooLong, bioMax, defaultCoordinates, ipAddress } from './test_helper';
import { newUser, credentialsNewUser, profileDataNewUser } from './test_helper_users';
import { initLoggedUser } from './test_helper_fns';
import { clearSessions } from '../repositories/sessionRepository';
import { clearUsers } from '../repositories/userRepository';
import { requestCoordinatesByIp, getLocation } from '../services/location';
import { createNewUser } from '../services/users';

const api = supertest(app);
jest.setTimeout(10000);

jest.mock('../services/location');
const requestCoordinatesByIpMock = jest.mocked(requestCoordinatesByIp);
const getLocationMock = jest.mocked(getLocation);

let loginRes = <supertest.Response>{};

describe('check access to profile page', () => {
	let id = <string>'';
	beforeAll(async () => {
		await clearUsers();
		requestCoordinatesByIpMock.mockReturnValue(Promise.resolve(defaultCoordinates));
		await createNewUser(newUser, ipAddress);
		loginRes = await initLoggedUser(newUser.username, credentialsNewUser);
		id = <string>JSON.parse(loginRes.text).id;
	});
	test('logged user can visit profile page', async () => {
		const resFromProfilePage = await api
			.get(`/api/users/${id}/profile`)
			.set({ Authorization: `bearer ${loginRes.body.token}` })
			.expect(200)
			.expect('Content-Type', /application\/json/);

		expect(resFromProfilePage.body).toBeTruthy();
		expect(resFromProfilePage.text).toContain('lorem');
	});
	test('not logged user cannot access profile page', async () => {
		const resFromProfilePage = await api
			.get(`/api/users/${id}/profile`)
			.expect(401)
			.expect('Content-Type', /application\/json/);

		expect(resFromProfilePage.body.error).toContain('Access denied, no token provided');
	});
	test('should fail when no id in request', async () => {
		const resFromProfilePage = await api
			.get(`/api/profile`)
			.set({ Authorization: `bearer ${loginRes.body.token}` })
			.expect(404);
		expect(resFromProfilePage.body.error).toContain('Unknown endpoint');
	});
	test('should fail request with wrong id in request', async () => {
		const resFromProfilePage = await api
			.get(`/api/users/11111111/profile`)
			.set({ Authorization: `bearer ${loginRes.body.token}` })
			.expect(400);
		expect(resFromProfilePage.body.error).toContain('No rights to get profile data');
	});
	test('fails when no session in db', async () => {
		await clearSessions();
		const resFromProfilePage = await api
			.get(`/api/users/${id}/profile`)
			.set({ Authorization: `bearer ${loginRes.body.token}` })
			.expect(401)
			.expect('Content-Type', /application\/json/);

		expect(resFromProfilePage.body.error).toContain('No sessions found');
	});
});

describe('Check responses and requests to api/profile', () => {
	let resFromProfile = <supertest.Response>{};
	let id = <string>'';
	const getResFromProfile = async (res: supertest.Response) => {
		return await api
			.get(`/api/users/${id}/profile`)
			.set({ Authorization: `bearer ${res.body.token}` })
			.expect(200);
	};
	beforeAll(async () => {
		await clearUsers();
		requestCoordinatesByIpMock.mockReturnValue(Promise.resolve(defaultCoordinates));
		await createNewUser(newUser, ipAddress);
		loginRes = await initLoggedUser(newUser.username, credentialsNewUser);
		id = <string>JSON.parse(loginRes.text).id;
		resFromProfile = await getResFromProfile(loginRes);
	});
	describe('Check repsonse of GET to /api/profile', () => {
		const putToProfile = async () => {
			getLocationMock.mockReturnValue(Promise.resolve('Helsinki, Finland'));
			await api
				.put(`/api/users/${id}/profile`)
				.set({ Authorization: `bearer ${loginRes.body.token}` })
				.send(profileDataNewUser)
				.expect(200);
			// if (res.body.error)
			// 	console.log(res.body.error);
		};

		test('should respond with baseUser + id on 1st access', () => {
			expect(resFromProfile.body).toBeTruthy();
			expect(resFromProfile.text).toContain('lorem');

			expect(JSON.parse(resFromProfile.text)).toEqual({
				id: id,
				username: 'matcha',
				firstname: 'lorem',
				lastname: 'ipsum',
				fameRating: 40,
				coordinates: defaultCoordinates,
				location: ''
			});
			// console.log(JSON.parse(resFromProfile.text));
		});

		test('should respond with UserData on 2nd+ access', async () => {
			getLocationMock.mockReturnValue(Promise.resolve('Helsinki, Finland'));
			await putToProfile();
			const newResFromProfile = await getResFromProfile(loginRes);
			expect(newResFromProfile.body).toBeTruthy();
			expect(JSON.parse(newResFromProfile.text)).toEqual({ ...profileDataNewUser, id: id });
			// console.log(JSON.parse(resFromProfile.text));
		});
	});

	describe('Check PUT requests to api/profile ', () => {
		const exactly18 = () => {
			const today = new Date();
			let date;
			let month;

			if (today.getDate() < 10) date = `0${today.getDate()}`;
			else date = `${today.getDate()}`;

			if (today.getMonth() + 1 < 10) month = `0${today.getMonth() + 1}`;
			else month = `${today.getMonth() + 1}`;
			return `${today.getFullYear() - 18}-${month}-${date}`;
		};
		test('should succeed with code(200)', async () => {
			getLocationMock.mockReturnValue(Promise.resolve('Helsinki, Finland'));
			await api
				.put(`/api/users/${id}/profile`)
				.set({ Authorization: `bearer ${loginRes.body.token}` })
				.send(profileDataNewUser)
				.expect(200);
			const newResFromProfile = await getResFromProfile(loginRes);
			expect(newResFromProfile.body).toBeTruthy();
			expect(JSON.parse(newResFromProfile.text)).toEqual({ ...profileDataNewUser, id: id });
		});

		it.each([
			// [{ ...profileData1, username: undefined }, 'Missing username'],
			// [{ ...profileData1, email: undefined }, 'Missing email'],
			[{ ...profileDataNewUser, firstname: undefined }, 'Missing first name'],
			[{ ...profileDataNewUser, lastname: undefined }, 'Missing last name'],
			[{ ...profileDataNewUser, birthday: undefined }, 'Missing birthay date'],
			[{ ...profileDataNewUser, gender: undefined }, 'Missing gender'],
			[{ ...profileDataNewUser, orientation: undefined }, 'Missing orientation'],
			[{ ...profileDataNewUser, bio: undefined }, 'Missing bio'],
			[{ ...profileDataNewUser, tags: undefined }, 'Missing tags']
		])(`put fails with missing profile payload values`, async (invalidInputs, expectedErrorMessage) => {
			getLocationMock.mockReturnValue(Promise.resolve('Helsinki, Finland'));
			const res = await api
				.put(`/api/users/${id}/profile`)
				.set({ Authorization: `bearer ${loginRes.body.token}` })
				.send(invalidInputs)
				.expect(400)
				.expect('Content-Type', /application\/json/);
			// console.log(res.body.error);
			expect(res.body.error).toContain(expectedErrorMessage);
		});
		// it.each([
		// 	[{ ...profileData1, username: '			' }, 'Missing username'],
		// 	[{ ...profileData1, username: 'mat' }, 'Username is too short'],
		// 	[{ ...profileData1, username: 'matcmatchamatchamatchaha' }, 'Username is too long'], //22chars
		// 	[{ ...profileData1, username: 'tes<3>' }, 'Invalid username'],
		// 	[{ ...profileData1, username: 'te st' }, 'Invalid username'],
		// 	[{ ...profileData1, username: 'te	st' }, 'Invalid username'],
		// 	[{ ...profileData1, username: 'te{st' }, 'Invalid username']
		// ])(`put fails with misformatted username`, async (invalidInputs, expectedErrorMessage) => {
		// 	const res = await api
		// 		.put(`/api/users/${id}/profile`)
		// 		.set({ Authorization: `bearer ${loginRes.body.token}` })
		// 		.send(invalidInputs)
		// 		.expect(400)
		// 		.expect('Content-Type', /application\/json/);
		// 	// console.log(res.body.error);
		// 	expect(res.body.error).toContain(expectedErrorMessage);
		// });
		// it.each([
		// 	[{ ...profileData1, email: '			' }, 'Missing email'],
		// 	[{ ...profileData1, email: 'mat' }, 'Invalid email'],
		// 	[{ ...profileData1, email: 'aalleex2222@yango' }, 'Invalid email'],
		// 	[{ ...profileData1, email: 1 }, 'Missing email'],
		// 	[{ ...profileData1, email: '@yangoo' }, 'Invalid email'],
		// 	[{ ...profileData1, email: '@hive.fi' }, 'Invalid email']
		// 	// [{ ...profileData1, email: 'a@hive.fi' }, 'Invalid email'],
		// 	// [{ ...profileData1, email: 'allex@hive.fi' }, 'Invalid email'],
		// ])(`put fails with misformatted email`, async (invalidInputs, expectedErrorMessage) => {
		// 	const res = await api
		// 		.put(`/api/users/${id}/profile`)
		// 		.set({ Authorization: `bearer ${loginRes.body.token}` })
		// 		.send(invalidInputs)
		// 		.expect(400)
		// 		.expect('Content-Type', /application\/json/);
		// 	// console.log(res.body.error);
		// 	expect(res.body.error).toContain(expectedErrorMessage);
		// });
		it.each([
			[{ ...profileDataNewUser, birthday: '11-03-b' }, 'Invalid birthday'],
			[{ ...profileDataNewUser, birthday: '32/09/1999' }, 'Invalid birthday'],
			[{ ...profileDataNewUser, birthday: '28/09/1999' }, 'Invalid birthday'],
			[{ ...profileDataNewUser, birthday: 1999 }, 'Invalid birthday'],
			[{ ...profileDataNewUser, birthday: '1999-13-23' }, 'Invalid birthday'],
			[{ ...profileDataNewUser, birthday: '1999-10-32' }, 'Invalid birthday'],
			[{ ...profileDataNewUser, birthday: '1999-10-32' }, 'Invalid birthday'],
			[{ ...profileDataNewUser, birthday: '1900-01-00' }, 'Invalid birthday'],
			[{ ...profileDataNewUser, birthday: '1899-12-31' }, 'Maximum age is exceeded'],
			[{ ...profileDataNewUser, birthday: '2006-11-15' }, 'User must be at least 18'],
			[{ ...profileDataNewUser, birthday: '2005-11-16' }, 'User must be at least 18']
		])(`put fails with invalid birthday`, async (invalidInputs, expectedErrorMessage) => {
			getLocationMock.mockReturnValue(Promise.resolve('Helsinki, Finland'));
			const res = await api
				.put(`/api/users/${id}/profile`)
				.set({ Authorization: `bearer ${loginRes.body.token}` })
				.send(invalidInputs)
				.expect(400)
				.expect('Content-Type', /application\/json/);
			// console.log(res.body.error);
			expect(res.body.error).toContain(expectedErrorMessage);
		});
		it.each([
			[{ ...profileDataNewUser, gender: 'boy' }, 'Invalid gender'],
			[{ ...profileDataNewUser, gender: 'male  ' }, 'Invalid gender'],
			[{ ...profileDataNewUser, gender: 'femal' }, 'Invalid gender']
		])(`put fails with misformatted gender`, async (invalidInputs, expectedErrorMessage) => {
			getLocationMock.mockReturnValue(Promise.resolve('Helsinki, Finland'));
			const res = await api
				.put(`/api/users/${id}/profile`)
				.set({ Authorization: `bearer ${loginRes.body.token}` })
				.send(invalidInputs)
				.expect(400)
				.expect('Content-Type', /application\/json/);
			// console.log(res.body.error);
			expect(res.body.error).toContain(expectedErrorMessage);
		});
		it.each([
			[{ ...profileDataNewUser, orientation: 'boy' }, 'Invalid orientation'],
			[{ ...profileDataNewUser, orientation: 'gay  ' }, 'Invalid orientation'],
			[{ ...profileDataNewUser, orientation: 'straite' }, 'Invalid orientation']
		])(`put fails with misformatted orientation`, async (invalidInputs, expectedErrorMessage) => {
			getLocationMock.mockReturnValue(Promise.resolve('Helsinki, Finland'));
			const res = await api
				.put(`/api/users/${id}/profile`)
				.set({ Authorization: `bearer ${loginRes.body.token}` })
				.send(invalidInputs)
				.expect(400)
				.expect('Content-Type', /application\/json/);
			// console.log(res.body.error);
			expect(res.body.error).toContain(expectedErrorMessage);
		});
		it.each([
			[{ ...profileDataNewUser, bio: 'aaaaa' }, 'Invalid bio'],
			[{ ...profileDataNewUser, bio: bioTooLong }, 'Invalid bio'],
			[{ ...profileDataNewUser, bio: 'aaaaaaaaa' }, 'Invalid bio']
		])(`put fails with invalid bio`, async (invalidInputs, expectedErrorMessage) => {
			getLocationMock.mockReturnValue(Promise.resolve('Helsinki, Finland'));
			const res = await api
				.put(`/api/users/${id}/profile`)
				.set({ Authorization: `bearer ${loginRes.body.token}` })
				.send(invalidInputs)
				.expect(400)
				.expect('Content-Type', /application\/json/);
			// console.log(res.body.error);
			expect(res.body.error).toContain(expectedErrorMessage);
		});
		it.each([
			[{ ...profileDataNewUser, tags: [] }, 'Invalid tags'],
			[{ ...profileDataNewUser, tags: [''] }, 'Invalid tags'],
			[{ ...profileDataNewUser, tags: ['Sauna', 'Swimming', 'Biking', 'BBQ', 'Drummer', 'Rave'] }, 'Invalid tags'],
			[{ ...profileDataNewUser, tags: ['Sauna', 'Swimming', 'Biking', 'BBQ', 1] }, 'Invalid tags'],
			[{ ...profileDataNewUser, tags: ['Sauna', 'Swimming', 'Biking', 'BBQ', 'Sauna'] }, 'Invalid tags']
		])(`put fails with invalid tags`, async (invalidInputs, expectedErrorMessage) => {
			getLocationMock.mockReturnValue(Promise.resolve('Helsinki, Finland'));
			const res = await api
				.put(`/api/users/${id}/profile`)
				.set({ Authorization: `bearer ${loginRes.body.token}` })
				.send(invalidInputs)
				.expect(400)
				.expect('Content-Type', /application\/json/);
			// console.log(res.body.error);
			expect(res.body.error).toContain(expectedErrorMessage);
		});
		it.each([
			[
				{ ...profileDataNewUser, firstname: '  Alekse-öäÖÄ    ßÜügggggg   ' },
				{ ...profileDataNewUser, firstname: 'Alekse-öäÖÄ ßÜügggggg' }
			],
			[
				{ ...profileDataNewUser, lastname: '  Alekse-öäÖÄ    ßÜügggggg   ' },
				{ ...profileDataNewUser, lastname: 'Alekse-öäÖÄ ßÜügggggg' }
			],
			[
				{ ...profileDataNewUser, orientation: 'gay' },
				{ ...profileDataNewUser, orientation: 'gay' }
			],
			[
				{ ...profileDataNewUser, orientation: 'straight' },
				{ ...profileDataNewUser, orientation: 'straight' }
			],
			[
				{ ...profileDataNewUser, orientation: 'bi' },
				{ ...profileDataNewUser, orientation: 'bi' }
			],
			[
				{ ...profileDataNewUser, gender: 'female' },
				{ ...profileDataNewUser, gender: 'female' }
			],
			[
				{ ...profileDataNewUser, gender: 'male' },
				{ ...profileDataNewUser, gender: 'male' }
			],
			[
				{ ...profileDataNewUser, bio: '1234567890' },
				{ ...profileDataNewUser, bio: '1234567890' }
			],
			[
				{ ...profileDataNewUser, bio: bioMax },
				{ ...profileDataNewUser, bio: bioMax }
			],
			[
				{ ...profileDataNewUser, tags: ['Rave', 'Pimms', 'BBQ', 'Drummer', 'Tea'] },
				{ ...profileDataNewUser, tags: ['Rave', 'Pimms', 'BBQ', 'Drummer', 'Tea'] }
			],
			[
				{ ...profileDataNewUser, birthday: exactly18() },
				{ ...profileDataNewUser, birthday: new Date(exactly18()).toISOString() }
			],
			[
				{ ...profileDataNewUser, birthday: new Date('1900-01-01').toISOString() },
				{ ...profileDataNewUser, birthday: new Date('1900-01-01').toISOString() }
			],
			[
				{ ...profileDataNewUser, birthday: '1999-03-22' },
				{ ...profileDataNewUser, birthday: new Date('1999-03-22').toISOString() }
			]
		])(`put succeeds with correct payload`, async (validInputs, payload) => {
			getLocationMock.mockReturnValue(Promise.resolve('Helsinki, Finland'));
			await api
				.put(`/api/users/${id}/profile`)
				.set({ Authorization: `bearer ${loginRes.body.token}` })
				.send(validInputs)
				.expect(200);
			// console.log(res.body.error);
			const newResFromProfile = await getResFromProfile(loginRes);
			expect(newResFromProfile.body).toBeTruthy();
			expect(JSON.parse(newResFromProfile.text)).toEqual({ ...payload, id: id });
		});
	});
});

// 		describe('check that no duplicates are allowed in username, email', () => {
// 			const initLoggedUser2 = async () => {
// 				const user = await findUserByUsername(secondUser.username);
// 				const activationCode = user?.activationCode;
// 				await api.post(`/api/users/activate/${activationCode}`);
// 				const res = await api.post('/api/login').send(loginUser2).expect(200);
// 				return res;
// 			};

// 			beforeAll(async () => {
// 				await createNewUser(secondUser);
// 				loginRes = await initLoggedUser2();
// 				id = <string>JSON.parse(loginRes.text).id;
// 				resFromProfile = await getResFromProfile(loginRes);
// 			});
// 			it.each([
// 				[{ ...infoProfile2, email: 'matcha@test.com' }, 'This email was already used'],
// 				[{ ...infoProfile2, username: 'matcha' }, 'Username already exists']
// 			])(`put fails with duplicate value for unique params`, async (invalidInputs, expectedErrorMessage) => {
// 				const res = await api
// 					.put(`/api/users/${id}/profile`)
// 					.set({ Authorization: `bearer ${loginRes.body.token}` })
// 					.send(invalidInputs)
// 					.expect(400)
// 					.expect('Content-Type', /application\/json/);
// 				//console.log(res.body.error);
// 				expect(res.body.error).toContain(expectedErrorMessage);
// 			});
// 		});
// 	});
// });
