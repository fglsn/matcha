import { describe, expect } from '@jest/globals';
import supertest from 'supertest';

import { app } from '../app';
import { clearUsers, findUserByUsername } from '../repositories/userRepository';
import { createNewUser } from '../services/users';
import { NewUser } from '../types';

const api = supertest(app);

jest.setTimeout(10000);

export const newUser: NewUser = {
	username: 'matcha',
	email: 'leverseau19@gmail.com',
	passwordPlain: 'Test!111',
	firstname: 'lorem',
	lastname: 'ipsum'
};


describe('password reset', () => {
	beforeEach(async () => {
		await clearUsers();
		await createNewUser(newUser);
	});

	test('reset password link is sent to user with correct email', async () => {
		const user = await findUserByUsername('matcha');

		//activate first
		const activationCode = user?.activationCode;
		console.log(activationCode);
		await api.get(`/api/users/activate/${activationCode}`).expect(200);

		const activeUser = await findUserByUsername('matcha');
		console.log(activeUser);
		if (activeUser) {
			expect(activeUser.isActive).toBe(true);
		}

		await api
			.post('/api/users/forgot_password')
			.send({email: 'leverseau19@gmail.com'})
			.expect(201);

	});
});