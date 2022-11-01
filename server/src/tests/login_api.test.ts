import { describe, expect } from '@jest/globals';
import supertest from 'supertest';

import { app } from '../app';
import { clearUsers } from '../repositories/userRepository';
import { createNewUser } from '../services/users';
import { newUser, loginUser } from './test_helper';

const api = supertest(app);

jest.setTimeout(10000);

const username = 'matcha';
const password = 'Test!111';

describe('user login', () => {
	beforeEach(async () => {
		await clearUsers();
		await createNewUser(newUser);
	});

	test('registered user can log in', async () => {
		const res = await api
			.post('/api/login')
			.send(loginUser)
			.expect(200)
			.expect('Content-Type', /application\/json/);

		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		expect(res.body).toHaveProperty('token');
	});

	test('login fails with non existing user', async () => {
		const res = await api
			.post('/api/login')
			.send({ username: 'wrong', password: 'Wrong!111' })
			.expect(401)
			.expect('Content-Type', /application\/json/);

		expect(res.body.error).toContain('User not found');
	});

	test('login fails with wrong password', async () => {
		const res = await api
			.post('/api/login')
			.send({ username: 'matcha', password: 'Wrong!111' })
			.expect(401)
			.expect('Content-Type', /application\/json/);

		expect(res.body.error).toContain('Wrong password');
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
		[{ username, password: 'Test!111Test!111Test!111Test!111Test!111Te' }, 'Password is too long'], //42
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
	});
});
