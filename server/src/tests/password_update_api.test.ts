import { describe, expect } from '@jest/globals';
import supertest from 'supertest';

import { app } from '../app';
import { getString } from '../dbUtils';
import { clearSessions } from '../repositories/sessionRepository';
import { clearUsers, findUserByUsername, getPasswordHash } from '../repositories/userRepository';
import { createNewUser } from '../services/users';
import { newUser, loginUser, newPass } from './test_helper';

const api = supertest(app);

jest.setTimeout(10000);

let loginRes = <supertest.Response>{};
let userId: string;
const oldPassword = newUser.passwordPlain;

const initLoggedUser = async () => {
	const user = await findUserByUsername(newUser.username);
	const activationCode = user?.activationCode;
	await api.get(`/api/users/activate/${activationCode}`);
	const res = await api.post('/api/login').send(loginUser).expect(200);
	return res;
};

describe('test update password access', () => {
	beforeEach(async () => {
		await clearUsers();
		await createNewUser(newUser);
		loginRes = await initLoggedUser();
		userId = getString(loginRes.body.id);
	});
	test('logged user can update password', async () => {
		const oldPwdHash = await getPasswordHash(userId);
		await api
			.put(`/api/users/update_password`)
			.set({ Authorization: `bearer ${loginRes.body.token}` })
			.send({ oldPassword, ...newPass })
			.expect(200);

		const newPwdHash = await getPasswordHash(userId);
		expect(oldPwdHash).not.toBe(newPwdHash);
	});
	test('not logged user not allowed to update password', async () => {
		const resFromPassUpdate = await api
			.put(`/api/users/update_password`)
			.expect(401)
			.expect('Content-Type', /application\/json/);

		expect(resFromPassUpdate.body.error).toContain('Access denied, no token provided');
	});
	test('fails when no session in db', async () => {
		await clearSessions();
		const resFromPassUpdate = await api
			.put(`/api/users/update_password`)
			.set({ Authorization: `bearer ${loginRes.body.token}` })
			.expect(401)
			.expect('Content-Type', /application\/json/);

		expect(resFromPassUpdate.body.error).toContain('No sessions found');
	});
	test('relogin with new password ', async () => {
		await api
			.put(`/api/users/update_password`)
			.set({ Authorization: `bearer ${loginRes.body.token}` })
			.send({ oldPassword, ...newPass })
			.expect(200);

		await api
			.post('/api/login')
			.send({ ...loginUser, ...newPass })
			.expect(200);
	});
	test('should fail to relogin with old password ', async () => {
		await api
			.put(`/api/users/update_password`)
			.set({ Authorization: `bearer ${loginRes.body.token}` })
			.send({ oldPassword, ...newPass })
			.expect(200);

		const resFromLogin = await api
			.post('/api/login')
			.send({ ...loginUser })
			.expect(401);
		expect(resFromLogin.body.error).toContain('Wrong password');
	});
});
