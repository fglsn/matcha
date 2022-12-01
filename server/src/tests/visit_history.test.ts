/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import supertest from 'supertest';
import { describe, expect } from '@jest/globals';
import { app } from '../app';
import { newUser, loginUser, infoProfile, defaultCoordinates, ipAddress, secondUser, loginUser2 } from './test_helper';
import { clearUsers, findUserByUsername } from '../repositories/userRepository';
import { requestCoordinatesByIp, getLocation } from '../services/location';
import { createNewUser } from '../services/users';
import { DataURL } from './test_helper_images';
import { getVisitHistoryByVisitedId, getVisitHistoryByVisitorId } from '../repositories/visitHistoryRepository';
import { NewUser } from '../types';
// import { clearSessions } from '../repositories/sessionRepository';

const api = supertest(app);

jest.setTimeout(10000);

jest.mock('../services/location');
const requestCoordinatesByIpMock = jest.mocked(requestCoordinatesByIp);
const getLocationMock = jest.mocked(getLocation);

let id = <string>'';
let loginRes = <supertest.Response>{};

let visitor: { id: string; token: string };
let visited: { id: string; token: string };

const initLoggedUser = async (username: string, loginUser: { username: string; password: string }) => {
	const user = await findUserByUsername(username);
	const activationCode = user?.activationCode;
	await api.post(`/api/users/activate/${activationCode}`);
	const res = await api.post('/api/login').send(loginUser).expect(200);
	return res;
};

const putToProfile = async (id: string) => {
	getLocationMock.mockReturnValue(Promise.resolve('Helsinki, Finland'));
	await api
		.put(`/api/users/${id}/profile`)
		.set({ Authorization: `bearer ${loginRes.body.token}` })
		.send(infoProfile)
		.expect(200);
	// if (res.body.error)
	// 	console.log(res.body.error);
};
const postToPhotos = async (id: string) => {
	await api
		.post(`/api/users/${id}/photos`)
		.set({ Authorization: `bearer ${loginRes.body.token}` })
		.send({ images: [{ dataURL: DataURL }] })
		.expect(200);
};

const loginAndPrepareUser = async (user: NewUser, loginUser: { username: string; password: string }) => {
	requestCoordinatesByIpMock.mockReturnValue(Promise.resolve(defaultCoordinates));
	await createNewUser(user, ipAddress);
	loginRes = await initLoggedUser(user.username, loginUser);
	id = <string>JSON.parse(loginRes.text).id;
	await Promise.all([putToProfile(id), postToPhotos(id)]);
	return { id: id, token: loginRes.body.token };
};

describe('visit history tests', () => {
	beforeAll(async () => {
		await clearUsers();
		visitor = await loginAndPrepareUser(newUser, loginUser);
		visited = await loginAndPrepareUser(secondUser, loginUser2);
	});

	test('unique user appears in visit history of a user whos profile was visited', async () => {
		const resFromProfilePage = await api
			.get(`/api/users/${visited.id}/public_profile`)
			.set({ Authorization: `bearer ${visitor.token}` })
			.expect('Content-Type', /application\/json/);

		expect(resFromProfilePage.statusCode).toBe(200);
		expect(resFromProfilePage.body).toBeTruthy();

		const visitHistoryAtEnd = await getVisitHistoryByVisitedId(visited.id);
		expect(visitHistoryAtEnd).toBeDefined();
		expect(visitHistoryAtEnd).toHaveLength(1);
		expect(visitHistoryAtEnd?.[0]).toEqual({ visitedUserId: visited.id, visitorUserId: visitor.id });
	});

	test('user doesnt appear in visit history again when visits multiple times', async () => {
		const resFromProfilePage = await api
			.get(`/api/users/${visited.id}/public_profile`)
			.set({ Authorization: `bearer ${visitor.token}` })
			.expect('Content-Type', /application\/json/);

		expect(resFromProfilePage.statusCode).toBe(200);
		expect(resFromProfilePage.body).toBeTruthy();
		// console.log(resFromProfilePage.text);

		await api
			.get(`/api/users/${visited.id}/public_profile`)
			.set({ Authorization: `bearer ${visitor.token}` })
			.expect('Content-Type', /application\/json/);

		await api
			.get(`/api/users/${visited.id}/public_profile`)
			.set({ Authorization: `bearer ${visitor.token}` })
			.expect('Content-Type', /application\/json/);

		const visitHistoryAtEnd = await getVisitHistoryByVisitedId(visited.id);
		expect(visitHistoryAtEnd).toBeDefined();
		expect(visitHistoryAtEnd).toHaveLength(1);
		expect(visitHistoryAtEnd?.[0]).toEqual({ visitedUserId: visited.id, visitorUserId: visitor.id });
	});

	test('user doesnt appear in visit history if visits his own profile', async () => {
		const resFromProfilePage = await api
			.get(`/api/users/${visited.id}/public_profile`)
			.set({ Authorization: `bearer ${visited.token}` })
			.expect('Content-Type', /application\/json/);

		expect(resFromProfilePage.statusCode).toBe(200);
		expect(resFromProfilePage.body).toBeTruthy();
		// console.log(resFromProfilePage.text);

		const visitHistoryAtEnd = await getVisitHistoryByVisitorId(visited.id);
		expect(visitHistoryAtEnd).not.toBeDefined();
	});
});
