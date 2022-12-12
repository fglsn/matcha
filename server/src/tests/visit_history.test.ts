/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import supertest from 'supertest';
import { app } from '../app';
import { describe, expect } from '@jest/globals';
import { clearVisitHistory, getVisitHistoryByVisitedId, getVisitHistoryByVisitorId } from '../repositories/visitHistoryRepository';
import { clearUsers } from '../repositories/userRepository';
import { newUser, loginUser, secondUser, loginUser2, TokenAndId } from './test_helper';
import { loginAndPrepareUser, userVisitsAnotherUsersProfile } from './test_helper_fns';

const api = supertest(app);
jest.setTimeout(10000);
jest.mock('../services/location');

let visitor: { id: string; token: string };
let visited: { id: string; token: string };

const checkVisitHistoryStats = async (owner: TokenAndId) => {
	const resFromStatsPage = await api
		.get(`/api/users/${owner.id}/visit_history`)
		.set({ Authorization: `bearer ${owner.token}` })
		.expect('Content-Type', /application\/json/);

	expect(resFromStatsPage.statusCode).toBe(200);
	return resFromStatsPage.body;
};

describe('visit history tests', () => {
	beforeAll(async () => {
		await clearUsers();
		visitor = await loginAndPrepareUser(newUser, loginUser);
		visited = await loginAndPrepareUser(secondUser, loginUser2);
	});

	beforeEach(async () => {
		await clearVisitHistory();
	});

	test('unique user appears in both visit histories: of visited and of visitor', async () => {
		await userVisitsAnotherUsersProfile(visited, visitor);

		const visitHistoryRepository = await getVisitHistoryByVisitedId(visited.id);
		expect(visitHistoryRepository).toBeTruthy();
		expect(visitHistoryRepository).toHaveLength(1);
		expect(visitHistoryRepository?.[0]).toEqual({ visitedUserId: visited.id, visitorUserId: visitor.id });

		const visitHistoryStatsOfVisited = await checkVisitHistoryStats(visited);
		expect(visitHistoryStatsOfVisited).toStrictEqual([[{ visitedUserId: visited.id, visitorUserId: visitor.id }], []]);

		const visitHistoryStatsOfVisitor = await checkVisitHistoryStats(visitor);
		expect(visitHistoryStatsOfVisitor).toStrictEqual([[], [{ visitedUserId: visited.id, visitorUserId: visitor.id }]]);
	});

	test('user doesnt appear in visit history again when visits multiple times', async () => {
		const visitHistoryStatsOfVisited = await checkVisitHistoryStats(visited);
		expect(visitHistoryStatsOfVisited).toStrictEqual([[], []]);

		const visitHistoryStatsOfVisitor = await checkVisitHistoryStats(visitor);
		expect(visitHistoryStatsOfVisitor).toStrictEqual([[], []]);

		await userVisitsAnotherUsersProfile(visited, visitor);

		const visitHistoryStatsOfVisitedAfterVisit = await checkVisitHistoryStats(visited);
		expect(visitHistoryStatsOfVisitedAfterVisit).toStrictEqual([[{ visitedUserId: visited.id, visitorUserId: visitor.id }], []]);

		const visitHistoryStatsOfVisitorAfterVisit = await checkVisitHistoryStats(visitor);
		expect(visitHistoryStatsOfVisitorAfterVisit).toStrictEqual([[], [{ visitedUserId: visited.id, visitorUserId: visitor.id }]]);

		await api
			.get(`/api/users/${visited.id}/public_profile`)
			.set({ Authorization: `bearer ${visitor.token}` })
			.expect('Content-Type', /application\/json/);

		await api
			.get(`/api/users/${visited.id}/public_profile`)
			.set({ Authorization: `bearer ${visitor.token}` })
			.expect('Content-Type', /application\/json/);

		const visitHistoryRepository = await getVisitHistoryByVisitedId(visited.id);
		expect(visitHistoryRepository).toBeTruthy();
		expect(visitHistoryRepository).toHaveLength(1);
		expect(visitHistoryRepository?.[0]).toEqual({ visitedUserId: visited.id, visitorUserId: visitor.id });

		const visitHistoryStatsOfVisitedEnd = await checkVisitHistoryStats(visited);
		expect(visitHistoryStatsOfVisitedEnd).toStrictEqual(visitHistoryStatsOfVisitedAfterVisit);

		const visitHistoryStatsOfVisitorEnd = await checkVisitHistoryStats(visitor);
		expect(visitHistoryStatsOfVisitorEnd).toStrictEqual(visitHistoryStatsOfVisitorAfterVisit);
	});

	test('user doesnt appear in visit history if visits his own profile', async () => {
		await userVisitsAnotherUsersProfile(visited, visited);

		const visitHistoryRepository = await getVisitHistoryByVisitorId(visited.id);
		expect(visitHistoryRepository).toStrictEqual([]);

		const visitHistoryStats = await checkVisitHistoryStats(visited);
		expect(visitHistoryStats).toStrictEqual([[], []]);
	});
});
