import { describe, expect } from '@jest/globals';
import supertest from 'supertest';

import { app } from '../app';
import { clearSessions } from '../repositories/sessionRepository';
import { clearUsers, findUserByUsername } from '../repositories/userRepository';
import { createNewUser } from '../services/users';
import { newUser, loginUser, infoProfile, bioTooLong, bioMax } from './test_helper';

const api = supertest(app);

jest.setTimeout(10000);

let loginRes = <supertest.Response>{};

// const initLoggedUser = async () => {
// 	const user = await findUserByUsername(newUser.username);
// 	const activationCode = user?.activationCode;
// 	await api.post(`/api/users/activate/${activationCode}`).expect(200);
// 	const activeUser = await findUserByUsername('matcha');
// 	if (!activeUser) fail();
// 	expect(activeUser.isActive).toBe(true);
// 	const res = await api
// 		.post('/api/login')
// 		.send(loginUser)
// 		.expect(200)
// 		.expect('Content-Type', /application\/json/);
// 	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
// 	const sessions = await findSessionsByUserId(res.body.id);
// 	expect(sessions).toBeTruthy();
// 	expect(sessions?.length).toBe(1);
// 	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
// 	expect(res.body).toHaveProperty('token');
// 	return res;
// };

const initLoggedUser = async () => {
	const user = await findUserByUsername(newUser.username);
	const activationCode = user?.activationCode;
	await api.post(`/api/users/activate/${activationCode}`);
	const res = await api.post('/api/login').send(loginUser).expect(200);
	return res;
};

describe('check access to account page', () => {
	let id = <string>'';
	beforeAll(async () => {
		await clearUsers();
		await createNewUser(newUser);
		loginRes = await initLoggedUser();
		id = <string>JSON.parse(loginRes.text).id;
	});
	test('logged user can visit account page', async () => {
		const resFromAccountPage = await api
			.get(`/api/account/${id}`)
			.set({ Authorization: `bearer ${loginRes.body.token}` })
			.expect(200)
			.expect('Content-Type', /application\/json/);

		expect(resFromAccountPage.body).toBeTruthy();
		expect(resFromAccountPage.text).toContain('lorem');
	});
	test('not logged user cannot access account page', async () => {
		const resFromAccountPage = await api
			.get(`/api/account/${id}`)
			.expect(401)
			.expect('Content-Type', /application\/json/);

		expect(resFromAccountPage.body.error).toContain('Access denied, no token provided');
	});
	test('should fail when no id in request', async () => {
		const resFromAccountPage = await api
			.get(`/api/account`)
			.set({ Authorization: `bearer ${loginRes.body.token}` })
			.expect(404);
		expect(resFromAccountPage.body.error).toContain('Unknown endpoint');
	});
	test('should fail request with wrong id in request', async () => {
		const resFromAccountPage = await api
			.get(`/api/account/11111111`)
			.set({ Authorization: `bearer ${loginRes.body.token}` })
			.expect(400);
		expect(resFromAccountPage.body.error).toContain('No rights to get profile data');
	});
	test('fails when no session in db', async () => {
		await clearSessions();
		const resFromAccountPage = await api
			.get(`/api/account/${id}`)
			.set({ Authorization: `bearer ${loginRes.body.token}` })
			.expect(401)
			.expect('Content-Type', /application\/json/);

		expect(resFromAccountPage.body.error).toContain('No sessions found');
	});
});

describe('Check responses and requests to api/account', () => {
	let resFromAccount = <supertest.Response>{};
	let id = <string>'';
	const getResFromAccount = async (res: supertest.Response) => {
		return await api
			.get(`/api/account/${id}`)
			.set({ Authorization: `bearer ${res.body.token}` })
			.expect(200);
	};
	beforeAll(async () => {
		await clearUsers();
		await createNewUser(newUser);
		loginRes = await initLoggedUser();
		id = <string>JSON.parse(loginRes.text).id;
		resFromAccount = await getResFromAccount(loginRes);
	});
	describe('Check repsonse of GET to /api/account', () => {
		const putToAccount = async () => {
			await api
				.put(`/api/account/${id}`)
				.set({ Authorization: `bearer ${loginRes.body.token}` })
				.send(infoProfile)
				.expect(200);
			// 	if (res.body.error)
			// 		console.log(res.body.error);
		};

		test('should respond with baseUser + id on 1st access', () => {
			expect(resFromAccount.body).toBeTruthy();
			expect(resFromAccount.text).toContain('lorem');

			expect(JSON.parse(resFromAccount.text)).toEqual({
				id: id,
				username: 'matcha',
				firstname: 'lorem',
				lastname: 'ipsum'
			});
			// console.log(JSON.parse(resFromAccount.text));
		});

		test('should respond with UserData on 2nd+ access', async () => {
			await putToAccount();
			const newResFromAccount = await getResFromAccount(loginRes);
			expect(newResFromAccount.body).toBeTruthy();
			expect(JSON.parse(newResFromAccount.text)).toEqual({ ...infoProfile, id: id });
			// console.log(JSON.parse(resFromAccount.text));
		});
	});

	describe('Check PUT requests to api/account ', () => {
		const exactly18 = () => {
			const today = new Date();
			return `${today.getFullYear() - 18}-${today.getMonth() + 1}-${today.getDate()}`;
		};
		test('should succeed with code(200)', async () => {
			await api
				.put(`/api/account/${id}`)
				.set({ Authorization: `bearer ${loginRes.body.token}` })
				.send(infoProfile)
				.expect(200);
			const newResFromAccount = await getResFromAccount(loginRes);
			expect(newResFromAccount.body).toBeTruthy();
			expect(JSON.parse(newResFromAccount.text)).toEqual({ ...infoProfile, id: id });
		});

		it.each([
			// [{ ...infoProfile, username: undefined }, 'Missing username'],
			// [{ ...infoProfile, email: undefined }, 'Missing email'],
			[{ ...infoProfile, firstname: undefined }, 'Missing first name'],
			[{ ...infoProfile, lastname: undefined }, 'Missing last name'],
			[{ ...infoProfile, birthday: undefined }, 'Missing birthay date'],
			[{ ...infoProfile, gender: undefined }, 'Missing gender'],
			[{ ...infoProfile, orientation: undefined }, 'Missing orientation'],
			[{ ...infoProfile, bio: undefined }, 'Missing bio']
		])(`put fails with missing account payload values`, async (invalidInputs, expectedErrorMessage) => {
			const res = await api
				.put(`/api/account/${id}`)
				.set({ Authorization: `bearer ${loginRes.body.token}` })
				.send(invalidInputs)
				.expect(400)
				.expect('Content-Type', /application\/json/);
			// console.log(res.body.error);
			expect(res.body.error).toContain(expectedErrorMessage);
		});
		// it.each([
		// 	[{ ...infoProfile, username: '			' }, 'Missing username'],
		// 	[{ ...infoProfile, username: 'mat' }, 'Username is too short'],
		// 	[{ ...infoProfile, username: 'matcmatchamatchamatchaha' }, 'Username is too long'], //22chars
		// 	[{ ...infoProfile, username: 'tes<3>' }, 'Invalid username'],
		// 	[{ ...infoProfile, username: 'te st' }, 'Invalid username'],
		// 	[{ ...infoProfile, username: 'te	st' }, 'Invalid username'],
		// 	[{ ...infoProfile, username: 'te{st' }, 'Invalid username']
		// ])(`put fails with misformatted username`, async (invalidInputs, expectedErrorMessage) => {
		// 	const res = await api
		// 		.put(`/api/account/${id}`)
		// 		.set({ Authorization: `bearer ${loginRes.body.token}` })
		// 		.send(invalidInputs)
		// 		.expect(400)
		// 		.expect('Content-Type', /application\/json/);
		// 	// console.log(res.body.error);
		// 	expect(res.body.error).toContain(expectedErrorMessage);
		// });
		// it.each([
		// 	[{ ...infoProfile, email: '			' }, 'Missing email'],
		// 	[{ ...infoProfile, email: 'mat' }, 'Invalid email'],
		// 	[{ ...infoProfile, email: 'aalleex2222@yango' }, 'Invalid email'],
		// 	[{ ...infoProfile, email: 1 }, 'Missing email'],
		// 	[{ ...infoProfile, email: '@yangoo' }, 'Invalid email'],
		// 	[{ ...infoProfile, email: '@hive.fi' }, 'Invalid email']
		// 	// [{ ...infoProfile, email: 'a@hive.fi' }, 'Invalid email'],
		// 	// [{ ...infoProfile, email: 'allex@hive.fi' }, 'Invalid email'],
		// ])(`put fails with misformatted email`, async (invalidInputs, expectedErrorMessage) => {
		// 	const res = await api
		// 		.put(`/api/account/${id}`)
		// 		.set({ Authorization: `bearer ${loginRes.body.token}` })
		// 		.send(invalidInputs)
		// 		.expect(400)
		// 		.expect('Content-Type', /application\/json/);
		// 	// console.log(res.body.error);
		// 	expect(res.body.error).toContain(expectedErrorMessage);
		// });
		it.each([
			[{ ...infoProfile, birthday: '11-03-b' }, 'Invalid birthday'],
			[{ ...infoProfile, birthday: '32/09/1999' }, 'Invalid birthday'],
			[{ ...infoProfile, birthday: '28/09/1999' }, 'Invalid birthday'],
			[{ ...infoProfile, birthday: 1999 }, 'Invalid birthday'],
			[{ ...infoProfile, birthday: '1999-13-23' }, 'Invalid birthday'],
			[{ ...infoProfile, birthday: '1999-10-32' }, 'Invalid birthday'],
			[{ ...infoProfile, birthday: '1999-10-32' }, 'Invalid birthday'],
			[{ ...infoProfile, birthday: '1900-01-00' }, 'Invalid birthday'],
			[{ ...infoProfile, birthday: '1899-12-31' }, 'Maximum age is exceeded'],
			[{ ...infoProfile, birthday: '2006-11-15' }, 'User must be at least 18'],
			[{ ...infoProfile, birthday: '2005-11-16' }, 'User must be at least 18']
		])(`put fails with invalid birthday`, async (invalidInputs, expectedErrorMessage) => {
			const res = await api
				.put(`/api/account/${id}`)
				.set({ Authorization: `bearer ${loginRes.body.token}` })
				.send(invalidInputs)
				.expect(400)
				.expect('Content-Type', /application\/json/);
			// console.log(res.body.error);
			expect(res.body.error).toContain(expectedErrorMessage);
		});
		it.each([
			[{ ...infoProfile, gender: 'boy' }, 'Invalid gender'],
			[{ ...infoProfile, gender: 'male  ' }, 'Invalid gender'],
			[{ ...infoProfile, gender: 'femal' }, 'Invalid gender']
		])(`put fails with misformatted gender`, async (invalidInputs, expectedErrorMessage) => {
			const res = await api
				.put(`/api/account/${id}`)
				.set({ Authorization: `bearer ${loginRes.body.token}` })
				.send(invalidInputs)
				.expect(400)
				.expect('Content-Type', /application\/json/);
			// console.log(res.body.error);
			expect(res.body.error).toContain(expectedErrorMessage);
		});
		it.each([
			[{ ...infoProfile, orientation: 'boy' }, 'Invalid orientation'],
			[{ ...infoProfile, orientation: 'gay  ' }, 'Invalid orientation'],
			[{ ...infoProfile, orientation: 'straite' }, 'Invalid orientation']
		])(`put fails with misformatted orientation`, async (invalidInputs, expectedErrorMessage) => {
			const res = await api
				.put(`/api/account/${id}`)
				.set({ Authorization: `bearer ${loginRes.body.token}` })
				.send(invalidInputs)
				.expect(400)
				.expect('Content-Type', /application\/json/);
			// console.log(res.body.error);
			expect(res.body.error).toContain(expectedErrorMessage);
		});
		it.each([
			[{ ...infoProfile, bio: 'aaaaa' }, 'Invalid bio'],
			[{ ...infoProfile, bio: bioTooLong }, 'Invalid bio'],
			[{ ...infoProfile, bio: 'aaaaaaaaa' }, 'Invalid bio']
		])(`put fails with invalid bio`, async (invalidInputs, expectedErrorMessage) => {
			const res = await api
				.put(`/api/account/${id}`)
				.set({ Authorization: `bearer ${loginRes.body.token}` })
				.send(invalidInputs)
				.expect(400)
				.expect('Content-Type', /application\/json/);
			// console.log(res.body.error);
			expect(res.body.error).toContain(expectedErrorMessage);
		});
		it.each([
			[
				{ ...infoProfile, orientation: 'gay' },
				{ ...infoProfile, orientation: 'gay' }
			],
			[
				{ ...infoProfile, orientation: 'straight' },
				{ ...infoProfile, orientation: 'straight' }
			],
			[
				{ ...infoProfile, orientation: 'bi' },
				{ ...infoProfile, orientation: 'bi' }
			],
			[
				{ ...infoProfile, gender: 'female' },
				{ ...infoProfile, gender: 'female' }
			],
			[
				{ ...infoProfile, gender: 'male' },
				{ ...infoProfile, gender: 'male' }
			],
			[
				{ ...infoProfile, bio: '1234567890' },
				{ ...infoProfile, bio: '1234567890' }
			],
			[
				{ ...infoProfile, bio: bioMax },
				{ ...infoProfile, bio: bioMax }
			],
			[
				{ ...infoProfile, birthday: exactly18() },
				{ ...infoProfile, birthday: new Date(exactly18()).toISOString() }
			],
			[
				{ ...infoProfile, birthday: new Date('1900-01-01').toISOString() },
				{ ...infoProfile, birthday: new Date('1900-01-01').toISOString() }
			],
			[
				{ ...infoProfile, birthday: '1999-03-22' },
				{ ...infoProfile, birthday: new Date('1999-03-22').toISOString() }
			]
		])(`put succeeds with correct payload`, async (validInputs, payload) => {
			await api
				.put(`/api/account/${id}`)
				.set({ Authorization: `bearer ${loginRes.body.token}` })
				.send(validInputs)
				.expect(200);
			// console.log(res.body.error);
			const newResFromAccount = await getResFromAccount(loginRes);
			expect(newResFromAccount.body).toBeTruthy();
			expect(JSON.parse(newResFromAccount.text)).toEqual({ ...payload, id: id });
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
// 				resFromAccount = await getResFromAccount(loginRes);
// 			});
// 			it.each([
// 				[{ ...infoProfile2, email: 'matcha@test.com' }, 'This email was already used'],
// 				[{ ...infoProfile2, username: 'matcha' }, 'Username already exists']
// 			])(`put fails with duplicate value for unique params`, async (invalidInputs, expectedErrorMessage) => {
// 				const res = await api
// 					.put(`/api/account/${id}`)
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
