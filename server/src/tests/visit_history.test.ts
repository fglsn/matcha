/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import supertest from 'supertest';
import { app } from '../app';
import { describe, expect } from '@jest/globals';
import { getVisitHistoryByVisitedId, getVisitHistoryByVisitorId } from '../repositories/visitHistoryRepository';
import { clearUsers } from '../repositories/userRepository';
import { newUser, loginUser, secondUser, loginUser2 } from './test_helper';
import { loginAndPrepareUser } from './test_helper_fns';

const api = supertest(app);
jest.setTimeout(10000);
jest.mock('../services/location');

let visitor: { id: string; token: string };
let visited: { id: string; token: string };

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
