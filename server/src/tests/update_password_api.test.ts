import supertest from 'supertest';
import { describe, expect } from '@jest/globals';
import { app } from '../app';
import { newUser, loginUser, newPass, defaultCoordinates, ipAddress } from './test_helper';
import { initLoggedUser } from './test_helper_fns';
import { clearUsers, getPasswordHash } from '../repositories/userRepository';
import { clearSessions } from '../repositories/sessionRepository';
import { requestCoordinatesByIp } from '../services/location';
import { createNewUser } from '../services/users';
import { getString } from '../dbUtils';

const api = supertest(app);

jest.setTimeout(10000);

jest.mock('../services/location');
const requestCoordinatesByIpMock = jest.mocked(requestCoordinatesByIp);

let userId: string;
let loginRes = <supertest.Response>{};
const oldPassword = newUser.passwordPlain;

describe('test update password access', () => {
	beforeEach(async () => {
		await clearUsers();
		requestCoordinatesByIpMock.mockReturnValue(Promise.resolve(defaultCoordinates));
		await createNewUser(newUser, ipAddress);
		loginRes = await initLoggedUser(newUser.username, loginUser);
		userId = getString(loginRes.body.id);
	});
	test('logged user can update password', async () => {
		const oldPwdHash = await getPasswordHash(userId);
		await api
			.put(`/api/users/${userId}/password`)
			.set({ Authorization: `bearer ${loginRes.body.token}` })
			.send({ oldPassword, ...newPass })
			.expect(200);

		const newPwdHash = await getPasswordHash(userId);
		expect(oldPwdHash).not.toBe(newPwdHash);
	});
	test('not logged user not allowed to update password', async () => {
		const resFromPassUpdate = await api
			.put(`/api/users/${userId}/password`)
			.expect(401)
			.expect('Content-Type', /application\/json/);

		expect(resFromPassUpdate.body.error).toContain('Access denied, no token provided');
	});
	test('fails when no session in db', async () => {
		await clearSessions();
		const resFromPassUpdate = await api
			.put(`/api/users/${userId}/password`)
			.set({ Authorization: `bearer ${loginRes.body.token}` })
			.expect(401)
			.expect('Content-Type', /application\/json/);

		expect(resFromPassUpdate.body.error).toContain('No sessions found');
	});
	test('relogin with new password ', async () => {
		await api
			.put(`/api/users/${userId}/password`)
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
			.put(`/api/users/${userId}/password`)
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
