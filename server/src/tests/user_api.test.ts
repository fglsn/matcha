import supertest from 'supertest';
import { describe, expect } from '@jest/globals';
import { app } from '../app';
import { newUser } from './test_helper_users';
import { defaultCoordinates, expectedResponseFromIpLocator, ipAddress } from './test_helper';
import { clearUsers, getAllUsers } from '../repositories/userRepository';
import { requestCoordinatesByIp } from '../services/location';
import { createNewUser } from '../services/users';

const api = supertest(app);

jest.setTimeout(10000);

const sendMailMock = jest.fn(); // this will return undefined if .sendMail() is called

jest.mock('nodemailer', () => ({
	createTransport: jest.fn().mockImplementation(() => {
		return {
			sendMail: sendMailMock
		};
	})
}));

jest.mock('../services/location');
const requestCoordinatesByIpMock = jest.mocked(requestCoordinatesByIp);

beforeEach(() => {
	sendMailMock.mockClear();
});

const username = 'test';
const email = 'test@test.com';
const passwordPlain = 'Test!111';
const firstname = 'Test';
const lastname = 'Testoff';

describe('user creation', () => {
	beforeEach(async () => {
		await clearUsers();
		requestCoordinatesByIpMock.mockReturnValue(Promise.resolve(defaultCoordinates));
		await createNewUser(newUser, ipAddress);
	});

	test('creation succeeds with a new valid payload', async () => {
		const usersAtStart = await getAllUsers();

		requestCoordinatesByIpMock.mockReturnValue(Promise.resolve(expectedResponseFromIpLocator));
		await api
			.post('/api/users')
			.send({ username, email, passwordPlain, firstname, lastname })
			.expect(201)
			.expect('Content-Type', /application\/json/);

		const usersAtEnd = await getAllUsers();
		expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

		const userInDb = usersAtEnd.find((user) => user.username === username);
		if (!userInDb) fail();
		expect(userInDb?.username).toEqual(username);
		expect(userInDb?.firstname).toEqual(firstname);
		expect(userInDb?.lastname).toEqual(lastname);
		expect(userInDb?.location).toEqual('');
		expect(userInDb?.coordinates).toEqual(expectedResponseFromIpLocator);

		expect(sendMailMock).toBeCalledTimes(1);
		expect(sendMailMock.mock.calls[0][0]['to']).toBe(email);
	});

	it.each([
		[{ email, passwordPlain, firstname, lastname }, 'Missing username'],
		[{ username, passwordPlain, firstname, lastname }, 'Missing email'],
		[{ username, email, firstname, lastname }, 'Missing password'],
		[{ username, email, passwordPlain, lastname }, 'Missing first name'],
		[{ username, email, passwordPlain, firstname }, 'Missing last name'],

		[{ username: '          ', email, passwordPlain, firstname, lastname }, 'Missing username'],
		[{ username: '					', email, passwordPlain, firstname, lastname }, 'Missing username'],
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
		[{ username, email, passwordPlain: 'Test!111Test!111Test!111Test!111Test!12211T3e', firstname, lastname }, 'Password is too long'], //43
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
