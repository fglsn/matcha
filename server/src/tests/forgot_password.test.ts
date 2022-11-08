import { describe, expect } from '@jest/globals';
import supertest from 'supertest';
import { app } from '../app';
import { clearUsers, findUserByUsername } from '../repositories/userRepository';
import { createNewUser } from '../services/users';
import { newUser } from './test_helper';
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

beforeEach(() => {
	sendMailMock.mockClear();
});

describe('password reset', () => {
	beforeEach(async () => {
		await clearUsers();
		await createNewUser(newUser);
	});

	test('reset password link is sent to user with correct email', async () => {
		const user = await findUserByUsername(newUser.username);

		//activate first
		const activationCode = user?.activationCode;
		// console.log(activationCode);
		await api.get(`/api/users/activate/${activationCode}`).expect(200);

		const activeUser = await findUserByUsername('matcha');
		// console.log(activeUser);
		if (activeUser) {
			expect(activeUser.isActive).toBe(true);
		}

		await api.post('/api/users/forgot_password').send({ email: newUser.email }).expect(201);

		expect(sendMailMock).toBeCalledTimes(1);
		expect(sendMailMock.mock.calls[0][0]['to']).toBe(newUser.email);
	});

	test('fails with incorrect (not valid) email', async () => {
		const res = await api
			.post('/api/users/forgot_password')
			.send({ email: 'wrong.com' })
			.expect(400)
			.expect('Content-Type', /application\/json/);
		expect(res.body.error).toContain('ValidationError: Invalid email');
	});

	test('fails with valid but not existing email', async () => {
		const res = await api
			.post('/api/users/forgot_password')
			.send({ email: 'wrong@wrong.com' })
			.expect(400)
			.expect('Content-Type', /application\/json/);
		expect(res.body.error).toContain(`Couldn't find this email address.`);
	});
});
