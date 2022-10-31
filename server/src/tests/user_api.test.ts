import { describe, expect } from '@jest/globals';
import supertest from 'supertest';

import { app } from '../app';
// import bcrypt from 'bcrypt';
import { addNewUser, clearUsers, getAllUsers } from '../repositories/userRepository';
import { newUser, newUserWithHashedPwd } from './test_helper';

const api = supertest(app);

jest.setTimeout(10000);

const username = 'test';
const email = 'test@test.com';
const passwordPlain = 'Test!111';
const firstname = 'Test';
const lastname = 'Testoff';

describe('user creation', () => {
	beforeEach(async () => {
		await clearUsers();
		await addNewUser(newUserWithHashedPwd);
	});

	test('creation succeeds with a new valid payload', async () => {
		const usersAtStart = await getAllUsers();

		await api
			.post('/api/users')
			.send({ username, email, passwordPlain, firstname, lastname })
			.expect(201)
			.expect('Content-Type', /application\/json/);

		const usersAtEnd = await getAllUsers();
		expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

		const usernames = usersAtEnd.map((u) => u.username);
		expect(usernames).toContain(newUser.username);
	});

	it.each([
		[{ email, passwordPlain, firstname, lastname }, 'Missing username'],
		[{ username, passwordPlain, firstname, lastname }, 'Missing email'],
		[{ username, email, firstname, lastname }, 'Missing password'],
		[{ username, email, passwordPlain, lastname }, 'Missing first name'],
		[{ username, email, passwordPlain, firstname }, 'Missing last name'],

		[{ username: 'tes', email, passwordPlain, firstname, lastname }, 'Username is too short'],
		[{ username: 'testtesttesttesttestte', email, passwordPlain, firstname, lastname }, 'Username is too long'], //22chars
		[{ username: 'tes<3>', email, passwordPlain, firstname, lastname }, 'Invalid username'],
		[{ username: 'te st', email, passwordPlain, firstname, lastname }, 'Invalid username'],
		[{ username: 'te	st', email, passwordPlain, firstname, lastname }, 'Invalid username'],
		[{ username: 'te{st', email, passwordPlain, firstname, lastname }, 'Invalid username'],

		[{ username, email: ' ', passwordPlain, firstname, lastname }, 'Missing email'],
		[{ username, email: 'testtest.com', passwordPlain, firstname, lastname }, 'Invalid email'],
		[{ username, email: '@test.com', passwordPlain, firstname, lastname }, 'Invalid email'],
		[{ username, email: '@test.com', passwordPlain, firstname, lastname }, 'Invalid email'],
		[{ username, email: 'test@@test.com', passwordPlain, firstname, lastname }, 'Invalid email'],

		[{ username, email, passwordPlain: 'Test!1', firstname, lastname }, 'Password is too short'],
		[{ username, email, passwordPlain: 'Test!111Test!111Test!111Test!111Test!111Te', firstname, lastname }, 'Password is too long'], //42
		[{ username, email, passwordPlain: 'testtest', firstname, lastname }, 'Weak password'],
		[{ username, email, passwordPlain: '12345678', firstname, lastname }, 'Weak password'],
		[{ username, email, passwordPlain: '12345678', firstname, lastname }, 'Weak password'],
		[{ username, email, passwordPlain: 'T!111111', firstname, lastname }, 'Weak password'],
		[{ username, email, passwordPlain: 't!111111', firstname, lastname }, 'Weak password'],
		[{ username, email, passwordPlain: 'TestTest!', firstname, lastname }, 'Weak password'],
		[{ username, email, passwordPlain: 'Test11111', firstname, lastname }, 'Weak password'],

		[{ username, email, passwordPlain, firstname: 'testtesttesttesttesttest', lastname }, 'First name is too long'], //24
		[{ username, email, passwordPlain, firstname: ' ', lastname }, 'Missing firstname'],
		[{ username, email, passwordPlain, firstname: '123', lastname }, 'Invalid firstname'],
		[{ username, email, passwordPlain, firstname: '<Test>', lastname }, 'Invalid firstname'],
		[{ username, email, passwordPlain, firstname: 'tes42', lastname }, 'Invalid firstname'],
		[{ username, email, passwordPlain, firstname: 'tes@t', lastname }, 'Invalid firstname'],

		[{ username, email, passwordPlain, firstname, lastname: 'testtesttesttesttesttesttesttesttesttesttes' }, 'Lastname is too long'], //42
		[{ username, email, passwordPlain, firstname, lastname: ' ' }, 'Missing lastname'],
		[{ username, email, passwordPlain, firstname, lastname: '123' }, 'Invalid lastname'],
		[{ username, email, passwordPlain, firstname, lastname: '<Test>' }, 'Invalid lastname'],
		[{ username, email, passwordPlain, firstname, lastname: 'tes42' }, 'Invalid lastname'],
		[{ username, email, passwordPlain, firstname, lastname: 'tes@t' }, 'Invalid lastname'],

		[{ username: 'matcha', email, passwordPlain, firstname, lastname }, 'Username already exists'],
		[{ username: '  matcha  ', email, passwordPlain, firstname, lastname }, 'Username already exists'],
		[{ username: '		matcha', email, passwordPlain, firstname, lastname }, 'Username already exists'],

		[{ username, email: 'matcha@test.com', passwordPlain, firstname, lastname }, 'This email was already used'],
		[{ username, email: 'MATCHA@test.com', passwordPlain, firstname, lastname }, 'This email was already used'],
		[{ username, email: 'matcha@Test.com', passwordPlain, firstname, lastname }, 'This email was already used'],
		[{ username, email: '   matcha@Test.com   ', passwordPlain, firstname, lastname }, 'This email was already used'],
		[{ username, email: 'MATCHA@TEST.COM', passwordPlain, firstname, lastname }, 'This email was already used']
	])(`creation fails with incorrect user payload %s %s`, async (incorrectUser, expectedErrorMessage) => {
		const usersAtStart = await getAllUsers();

		// console.log(`Payload: ${incorrectUser}, Expected msg: ${expectedErrorMessage}`);
		const res = await api
			.post('/api/users')
			.send(incorrectUser)
			.expect(400)
			.expect('Content-Type', /application\/json/);

		// console.log(res.body.error);
		expect(res.body.error).toContain(expectedErrorMessage);

		const usersAtEnd = await getAllUsers();
		expect(usersAtEnd).toEqual(usersAtStart);
	});
});
