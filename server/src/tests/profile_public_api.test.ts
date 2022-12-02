import supertest from 'supertest';
import { app } from '../app';
import { describe, expect } from '@jest/globals';
import { newUser, loginUser, infoProfilePublic } from './test_helper';
import { loginAndPrepareUser } from './test_helper_fns';
import { clearSessions } from '../repositories/sessionRepository';
import { clearUsers } from '../repositories/userRepository';

const api = supertest(app);
jest.setTimeout(10000);
jest.mock('../services/location');

let user: { id: string; token: string };

describe('check access to profile page', () => {
	beforeAll(async () => {
		await clearUsers();
		user = await loginAndPrepareUser(newUser, loginUser);
	});
	test('logged user can visit public profile page', async () => {
		const resFromProfilePage = await api
			.get(`/api/users/${user.id}/public_profile`)
			.set({ Authorization: `bearer ${user.token}` })
			.expect('Content-Type', /application\/json/);

		expect(resFromProfilePage.statusCode).toBe(200);
		expect(resFromProfilePage.body).toBeTruthy();
		//console.log(resFromProfilePage.text);

		expect(resFromProfilePage.text).toContain('lorem');
		expect(JSON.parse(resFromProfilePage.text)).toEqual({ ...infoProfilePublic, id: user.id });
	});
	test('not logged user cannot access profile page', async () => {
		const resFromProfilePage = await api
			.get(`/api/users/${user.id}/public_profile`)
			.expect(401)
			.expect('Content-Type', /application\/json/);

		expect(resFromProfilePage.body.error).toContain('Access denied, no token provided');
	});
	test('should fail when no id in request', async () => {
		const resFromProfilePage = await api
			.get(`/api/users//public_profile`)
			.set({ Authorization: `bearer ${user.token}` })
			.expect(404);
		expect(resFromProfilePage.body.error).toContain('Unknown endpoint');
	});
	test('should fail request with wrong id in request', async () => {
		const resFromProfilePage = await api
			.get(`/api/users/11111111/public_profile`)
			.set({ Authorization: `bearer ${user.token}` })
			.expect(400);
		expect(resFromProfilePage.body.error).toContain('No user with provided id');
	});
	test('fails when no session in db', async () => {
		await clearSessions();
		const resFromProfilePage = await api
			.get(`/api/users/${user.id}/public_profile`)
			.set({ Authorization: `bearer ${user.token}` })
			.expect(401)
			.expect('Content-Type', /application\/json/);

		expect(resFromProfilePage.body.error).toContain('No sessions found');
	});
});
