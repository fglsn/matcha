import { describe, expect } from '@jest/globals';
import supertest from 'supertest';

import { app } from '../app';
// import bcrypt from 'bcrypt';
import { clearUsers, getAllUsers } from '../repositories/userRepository';
import { newUser } from './test_helper';

const api = supertest(app);

jest.setTimeout(10000);

const username = 'test';
const email = 'test@test.com';
const password = 'Test!111';
const firstname = 'Test';
const lastname = 'Testoff';

describe('user creation', () => {
	beforeEach(async () => {
		await clearUsers();
		// await addNewUser(newUser);
	});

	test('creation succeeds with a new valid payload', async () => {
		const usersAtStart = await getAllUsers();

		await api
			.post('/api/users')
			.send(newUser)
			.expect(201)
			.expect('Content-Type', /application\/json/);

		const usersAtEnd = await getAllUsers();
		expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

		const usernames = usersAtEnd.map((u) => u.username);
		expect(usernames).toContain(newUser.username);
	});

	it.each([
		[{ email, password, firstname, lastname }, 'Missing username'],
		[{ username, password, firstname, lastname }, 'Missing email'],
		[{ username, email, firstname, lastname }, 'Missing password'],
		[{ username, email, password, lastname }, 'Missing first name'],
		[{ username, email, password, firstname }, 'Missing last name'],

		[{ username: 'tes', email, password, firstname, lastname }, 'Username is too short'],
		[{ username: 'testtesttesttesttestte', email, password, firstname, lastname }, 'Username is too long'], //22chars
		[{ username: 'tes<3>', email, password, firstname, lastname }, 'Invalid username'],
		[{ username: 'te st', email, password, firstname, lastname }, 'Invalid username'],
		[{ username: 'te	st', email, password, firstname, lastname }, 'Invalid username'],
		[{ username: 'te{st', email, password, firstname, lastname }, 'Invalid username'],

		[{ username, email: ' ', password, firstname, lastname }, 'Missing email'],
		[{ username, email: 'testtest.com', password, firstname, lastname }, 'Invalid email'],
		[{ username, email: '@test.com', password, firstname, lastname }, 'Invalid email'],
		[{ username, email: '@test.com', password, firstname, lastname }, 'Invalid email'],
		[{ username, email: 'test@@test.com', password, firstname, lastname }, 'Invalid email'],

		[{ username, email, password: 'Test!1', firstname, lastname }, 'Password is too short'],
		[{ username, email, password: 'Test!111Test!111Test!111Test!111Test!111Te', firstname, lastname }, 'Password is too long'], //42
		[{ username, email, password: 'testtest', firstname, lastname }, 'Weak password'],
		[{ username, email, password: '12345678', firstname, lastname }, 'Weak password'],
		[{ username, email, password: '12345678', firstname, lastname }, 'Weak password'],
		[{ username, email, password: 'T!111111', firstname, lastname }, 'Weak password'],
		[{ username, email, password: 't!111111', firstname, lastname }, 'Weak password'],
		[{ username, email, password: 'TestTest!', firstname, lastname }, 'Weak password'],
		[{ username, email, password: 'Test11111', firstname, lastname }, 'Weak password'],

		[{ username, email, password, firstname: 'testtesttesttesttesttest', lastname }, 'First name is too long'], //24
		[{ username, email, password, firstname: ' ', lastname }, 'Missing firstname'],
		[{ username, email, password, firstname: '123', lastname }, 'Invalid firstname'],
		[{ username, email, password, firstname: '<Test>', lastname }, 'Invalid firstname'],
		[{ username, email, password, firstname: 'tes42', lastname }, 'Invalid firstname'],
		[{ username, email, password, firstname: 'tes@t', lastname }, 'Invalid firstname'],

		[{ username, email, password, firstname, lastname: 'testtesttesttesttesttesttesttesttesttesttes' }, 'Lastname is too long'], //42
		[{ username, email, password, firstname, lastname: ' ' }, 'Invalid lastname'],
		[{ username, email, password, firstname, lastname: '123' }, 'Invalid lastname'],
		[{ username, email, password, firstname, lastname: '<Test>' }, 'Invalid lastname'],
		[{ username, email, password, firstname, lastname: 'tes42' }, 'Invalid lastname'],
		[{ username, email, password, firstname, lastname: 'tes@t' }, 'Invalid lastname'],

		[{ username: 'matcha', email, password, firstname, lastname }, 'Username already exists'],
		[{ username: '  matcha  ', email, password, firstname, lastname }, 'Username already exists'],
		[{ username: '		matcha', email, password, firstname, lastname }, 'Username already exists'],

		[{ username, email: 'matcha@test.com', password, firstname, lastname }, 'This email was already used'],
		[{ username, email: 'MATCHA@test.com', password, firstname, lastname }, 'This email was already used'],
		[{ username, email: 'matcha@Test.com', password, firstname, lastname }, 'This email was already used'],
		[{ username, email: '   matcha@Test.com   ', password, firstname, lastname }, 'This email was already used'],
		[{ username, email: 'MATCHA@TEST.COM', password, firstname, lastname }, 'This email was already used']
	])('creation fails with incorrect user payload', async (incorrectUser, expectedErrorMessage) => {
		const usersAtStart = await getAllUsers();

		const res = await api
			.post('/api/users')
			.send(incorrectUser)
			.expect(400)
			.expect('Content-Type', /application\/json/);

		expect(res.body.error).toContain(expectedErrorMessage);

		const usersAtEnd = await getAllUsers();
		expect(usersAtEnd).toEqual(usersAtStart);
	});
});
