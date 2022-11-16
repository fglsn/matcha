import { describe, expect } from '@jest/globals';
import supertest from 'supertest';

import { app } from '../app';
import { clearSessions } from '../repositories/sessionRepository';
// import { clearSessions, findSessionsByUserId } from '../repositories/sessionRepository';
import { clearUsers, findUserByUsername } from '../repositories/userRepository';
import { createNewUser } from '../services/users';
// import { UserData } from '../types';
import { newUser, loginUser, infoProfile } from './test_helper';

const api = supertest(app);

jest.setTimeout(10000);

let loginRes = <supertest.Response>{};

// const initLoggedUser = async () => {
// 	const user = await findUserByUsername(newUser.username);
// 	const activationCode = user?.activationCode;
// 	await api.get(`/api/users/activate/${activationCode}`).expect(200);
// 	const activeUser = await findUserByUsername('matcha');
// 	if (!activeUser) fail();
// 	expect(activeUser.isActive).toBe(true);
// 	const res = await api
// 		.post('/api/login')
// 		.send(loginUser)
// 		.expect(200)
// 		.expect('Content-Type', /application\/json/);
// 	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
// 	const sessions = await findSessionsByUserId(res.body.id);
// 	expect(sessions).toBeTruthy();
// 	expect(sessions?.length).toBe(1);
// 	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
// 	expect(res.body).toHaveProperty('token');
// 	return res;
// };

const initLoggedUser = async () => {
	const user = await findUserByUsername(newUser.username);
	const activationCode = user?.activationCode;
	await api.get(`/api/users/activate/${activationCode}`);
	const res = await api.post('/api/login').send(loginUser).expect(200);
	return res;
};

describe('check access to profile page', () => {
	beforeAll(async () => {
		await clearUsers();
		await createNewUser(newUser);
		loginRes = await initLoggedUser();
	});
	test('logged user can visit profile page', async () => {
		const resFromProfilePage = await api
			.get('/api/profile')
			.set({ Authorization: `bearer ${loginRes.body.token}` })
			.expect(200)
			.expect('Content-Type', /application\/json/);

		expect(resFromProfilePage.body).toBeTruthy();
		expect(resFromProfilePage.text).toContain('lorem');
	});
	test('not logged user cannot access profile page', async () => {
		const resFromProfilePage = await api
			.get('/api/profile')
			.expect(401)
			.expect('Content-Type', /application\/json/);

		expect(resFromProfilePage.body.error).toContain('Access denied, no token provided');
	});
	test('fails when no session in db', async () => {
		await clearSessions();
		const resFromProfilePage = await api
			.get('/api/profile')
			.set({ Authorization: `bearer ${loginRes.body.token}` })
			.expect(401)
			.expect('Content-Type', /application\/json/);

		expect(resFromProfilePage.body.error).toContain('No sessions found');
	});
});

describe('Check repsonse of GET to /api/profile', () => {
	let resFromProfile = <supertest.Response>{};

	const getResFromProfile = async (res: supertest.Response) => {
		return await api.get('/api/profile').set({ Authorization: `bearer ${res.body.token}` });
	};

	const putToProfile = async () => {
		await api
			.put('/api/profile')
			.set({ Authorization: `bearer ${loginRes.body.token}` })
			.send(infoProfile)
			.expect(201);

		//for debugging internal errors
		// const res = await api
		// .put('/api/profile')
		// .set({ Authorization: `bearer ${loginRes.body.token}` })
		// .send(infoProfile)
		// .expect(201);
		// if (res.body.error)
		// 	console.log(res.body.error);
	};

	beforeAll(async () => {
		await clearUsers();
		await createNewUser(newUser);
		loginRes = await initLoggedUser();
		resFromProfile = await getResFromProfile(loginRes);
	});

	test('should respond with baseUser + id on 1st access', () => {
		const id = <string>JSON.parse(loginRes.text).id;
		expect(resFromProfile.body).toBeTruthy();
		expect(resFromProfile.text).toContain('lorem');

		//console.log(loginRes.text);

		expect(JSON.parse(resFromProfile.text)).toEqual({
			id: id,
			username: 'matcha',
			email: 'matcha@test.com',
			firstname: 'lorem',
			lastname: 'ipsum'
		});
		// console.log(JSON.parse(resFromProfile.text));
	});

	test('should respond with UserData on 2nd+ access', async () => {
		const id = <string>JSON.parse(loginRes.text).id;
		await putToProfile();
		const newResFromProfile = await getResFromProfile(loginRes);
		expect(newResFromProfile.body).toBeTruthy();
		expect(newResFromProfile.text).toContain('lorem');

		//console.log(loginRes.text);

		expect(JSON.parse(newResFromProfile.text)).toEqual({ ...infoProfile, id: id });
		// console.log(JSON.parse(resFromProfile.text));
	});
});
