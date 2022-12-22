import { describe, expect } from '@jest/globals';
import supertest from 'supertest';

import { app } from '../app';
import { findSessionsByUserId } from '../repositories/sessionRepository';
import { clearUsers, findUserByUsername } from '../repositories/userRepository';
import { requestCoordinatesByIp } from '../services/location';
import { createNewUser } from '../services/users';
import { ipAddress, defaultCoordinates } from './test_helper';
import { credentialsNewUser, newUser } from './test_helper_users';

const api = supertest(app);

jest.setTimeout(10000);

const username = 'matcha';
const password = 'Test!111';

jest.mock('../services/location');
const requestCoordinatesByIpMock = jest.mocked(requestCoordinatesByIp);

describe('user login', () => {
	beforeEach(async () => {
		await clearUsers();
		requestCoordinatesByIpMock.mockReturnValue(Promise.resolve(defaultCoordinates));
		await createNewUser(newUser, ipAddress);
	});

	test('activated user can log in', async () => {
		const user = await findUserByUsername(newUser.username);
		if (user) {
			const activationCode = user.activationCode;

			await api.post(`/api/users/activate/${activationCode}`).expect(200);

			const activeUser = await findUserByUsername(newUser.username);
			if (activeUser) {
				expect(activeUser.isActive).toBe(true);
			}
		}

		const res = await api
			.post('/api/login')
			.send(credentialsNewUser)
			.expect(200)
			.expect('Content-Type', /application\/json/);

		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		const sessions = await findSessionsByUserId(res.body.id);
		expect(sessions).toBeTruthy();
		expect(sessions?.length).toBe(1);
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		expect(res.body).toHaveProperty('token');
	});

	test('login fail with non active user', async () => {
		const user = await findUserByUsername(newUser.username);
		if (user) {
			const nonActiveUser = await findUserByUsername(newUser.username);
			if (nonActiveUser) {
				expect(nonActiveUser.isActive).toBe(false);
			}
		}
		const res = await api
			.post('/api/login')
			.send(credentialsNewUser)
			.expect(401)
			.expect('Content-Type', /application\/json/);

		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		expect(res.body.error).toContain('Account is not active');
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		const sessions = await findSessionsByUserId(res.body.id);
		expect(sessions).toBeFalsy();
		expect(res.body).not.toHaveProperty('token');
	});

	test('login fails with non existing user', async () => {
		const res = await api
			.post('/api/login')
			.send({ username: 'wrong', password: 'Wrong!111' })
			.expect(401)
			.expect('Content-Type', /application\/json/);

		expect(res.body.error).toContain('User not found');
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		const sessions = await findSessionsByUserId(res.body.id);
		expect(sessions).toBeFalsy();
		expect(res.body).not.toHaveProperty('token');
	});

	test('login fails with wrong password', async () => {
		const res = await api
			.post('/api/login')
			.send({ username: newUser.username, password: 'Wrong!111' })
			.expect(401)
			.expect('Content-Type', /application\/json/);

		expect(res.body.error).toContain('Wrong password');
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		const sessions = await findSessionsByUserId(res.body.id);
		expect(sessions).toBeFalsy();
		expect(res.body).not.toHaveProperty('token');
	});

	it.each([
		[{ password }, 'Missing username'],
		[{ username }, 'Missing password'],

		[{ username: '          ' }, 'Missing username'],
		[{ username: '			' }, 'Missing username'],

		[{ username: 'mat', password }, 'Username is too short'],
		[{ username: 'matcmatchamatchamatchaha', password }, 'Username is too long'], //22chars
		[{ username: 'tes<3>', password }, 'Invalid username'],
		[{ username: 'te st', password }, 'Invalid username'],
		[{ username: 'te	st', password }, 'Invalid username'],
		[{ username: 'te{st', password }, 'Invalid username'],

		[{ username, password: 'Test!1' }, 'Password is too short'],
		[{ username, password: 'Test!111Test!111Test!111Test!111Test!111Te2' }, 'Password is too long'], //43
		[{ username, password: 'testtest' }, 'Weak password'],
		[{ username, password: '12345678' }, 'Weak password'],
		[{ username, password: '12345678' }, 'Weak password'],
		[{ username, password: 'T!111111' }, 'Weak password'],
		[{ username, password: 't!111111' }, 'Weak password'],
		[{ username, password: 'TestTest!' }, 'Weak password'],
		[{ username, password: 'Test11111' }, 'Weak password']
	])(`login fails with incorrect input values (failed by basic validators)`, async (invalidInputs, expectedErrorMessage) => {
		// console.log(`Payload: ${incorrectUser}, Expected msg: ${expectedErrorMessage}`);
		const res = await api
			.post('/api/login')
			.send(invalidInputs)
			.expect(400)
			.expect('Content-Type', /application\/json/);

		// console.log(res.body.error);
		expect(res.body.error).toContain(expectedErrorMessage);
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		const sessions = await findSessionsByUserId(res.body.id);
		expect(sessions).toBeFalsy();
		expect(res.body).not.toHaveProperty('token');
	});
});
