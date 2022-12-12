/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { describe, expect } from '@jest/globals';
import { clearUsers } from '../repositories/userRepository';
import { newUser, loginUser, secondUser, loginUser2, TokenAndId } from './test_helper';
import { api, loginAndPrepareUser, putLike, removeLike, twoUserLikeEachOther } from './test_helper_fns';
import { clearLikes } from '../repositories/likesRepository';
import { checkMatchEntry } from '../repositories/matchesRepository';

jest.setTimeout(10000);
jest.mock('../services/location');

let userOne: { id: string; token: string };
let userTwo: { id: string; token: string };

export const checkMatchesStats = async (owner: TokenAndId) => {
	const resFromStatsPage = await api
		.get(`/api/users/${owner.id}/matches`)
		.set({ Authorization: `bearer ${owner.token}` })
		.expect('Content-Type', /application\/json/);

	expect(resFromStatsPage.statusCode).toBe(200);
	return resFromStatsPage.body;
};

describe('test matches', () => {
	beforeEach(async () => {
		await clearUsers();
		await clearLikes();
		userOne = await loginAndPrepareUser(newUser, loginUser);
		userTwo = await loginAndPrepareUser(secondUser, loginUser2);
	});

	test('match value is false on GET user/:id/like request when no match between users', async () => {
		await putLike(userOne, userTwo);

		const res = await api
			.get(`/api/users/${userOne.id}/like`)
			.set({ Authorization: `bearer ${userTwo.token}` })
			.expect(200)
			.expect('Content-Type', /application\/json/);

		expect(res.body.match).toBeFalsy();
		const firstUserStats = await checkMatchesStats(userOne);
		expect(firstUserStats).toStrictEqual([]);
		const secondUserStats = await checkMatchesStats(userTwo);
		expect(secondUserStats).toStrictEqual([]);
	});

	test('match appears when user likes another user back', async () => {
		await twoUserLikeEachOther(userOne, userTwo);
		const firstUserStats = await checkMatchesStats(userOne);
		expect(firstUserStats).toStrictEqual([{ matchedUserIdOne: userOne.id, matchedUserIdTwo: userTwo.id }]);
		const secondUserStats = await checkMatchesStats(userTwo);
		expect(secondUserStats).toStrictEqual([{ matchedUserIdOne: userOne.id, matchedUserIdTwo: userTwo.id }]);
	});

	test('match value is true on GET  user/:id/like request when match between users', async () => {
		await putLike(userOne, userTwo);
		await putLike(userTwo, userOne);

		const res = await api
			.get(`/api/users/${userOne.id}/like`)
			.set({ Authorization: `bearer ${userTwo.token}` })
			.expect(200)
			.expect('Content-Type', /application\/json/);

		expect(res.body.match).toBeTruthy();

		const firstUserStats = await checkMatchesStats(userOne);
		expect(firstUserStats).toStrictEqual([{ matchedUserIdOne: userOne.id, matchedUserIdTwo: userTwo.id }]);
		const secondUserStats = await checkMatchesStats(userTwo);
		expect(secondUserStats).toStrictEqual([{ matchedUserIdOne: userOne.id, matchedUserIdTwo: userTwo.id }]);
	});

	test('match disappears when user removes a like', async () => {
		await twoUserLikeEachOther(userOne, userTwo);

		await removeLike(userOne, userTwo);
		const [res1, res2] = await Promise.all([checkMatchEntry(userOne.id, userTwo.id), checkMatchEntry(userTwo.id, userOne.id)]);
		expect(res1).toBeFalsy();
		expect(res2).toBeFalsy();

		const firstUserStats = await checkMatchesStats(userOne);
		expect(firstUserStats).toStrictEqual([]);
		const secondUserStats = await checkMatchesStats(userTwo);
		expect(secondUserStats).toStrictEqual([]);
	});

	test('no mathes appears when only one user puts a like', async () => {
		await putLike(userOne, userTwo);

		const [res1, res2] = await Promise.all([checkMatchEntry(userOne.id, userTwo.id), checkMatchEntry(userTwo.id, userOne.id)]);
		expect(res1).toBeFalsy();
		expect(res2).toBeFalsy();

		const firstUserStats = await checkMatchesStats(userOne);
		expect(firstUserStats).toStrictEqual([]);
		const secondUserStats = await checkMatchesStats(userTwo);
		expect(secondUserStats).toStrictEqual([]);
	});
});
