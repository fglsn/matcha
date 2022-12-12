/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { describe, expect } from '@jest/globals';
import { clearUsers } from '../repositories/userRepository';
import { newUser, loginUser, secondUser, loginUser2, infoProfilePublic, infoProfilePublic2, TokenAndId } from './test_helper';
import { api, loginAndPrepareUser, putLike, twoUserLikeEachOther, userBlocksAnotherUser } from './test_helper_fns';
import { clearLikes, getLikesByVisitorId } from '../repositories/likesRepository';
import { checkMatchEntry } from '../repositories/matchesRepository';
import { checkBlockEntry, removeBlockEntry } from '../repositories/blockEntriesRepository';
import { clearVisitHistory } from '../repositories/visitHistoryRepository';
import { checkLikesHistoryStats } from './likes_history.test';
import { checkMatchesStats } from './matches_api.test';

jest.setTimeout(10000);
jest.mock('../services/location');

let userThatBlocks: { id: string; token: string };
let userToBlock: { id: string; token: string };

const checkBlocksStats = async (owner: TokenAndId) => {
	const resFromStatsPage = await api
		.get(`/api/users/${owner.id}/blocks`)
		.set({ Authorization: `bearer ${owner.token}` })
		.expect('Content-Type', /application\/json/);

	expect(resFromStatsPage.statusCode).toBe(200);
	return resFromStatsPage.body;
};

const baseFameRating = 47;
describe('test block user functionality', () => {
	beforeEach(async () => {
		await clearUsers();
		await clearLikes();
		await clearVisitHistory();
		userThatBlocks = await loginAndPrepareUser(newUser, loginUser);
		userToBlock = await loginAndPrepareUser(secondUser, loginUser2);
	});

	test('user can block another user', async () => {
		const blockStatusAtStart = await checkBlockEntry(userToBlock.id, userThatBlocks.id);
		expect(blockStatusAtStart).toBeFalsy();

		await userBlocksAnotherUser(userToBlock, userThatBlocks);

		const firstUserStats = await checkBlocksStats(userToBlock);
		expect(firstUserStats).toStrictEqual([]);
		const secondUserStats = await checkBlocksStats(userThatBlocks);
		expect(secondUserStats).toStrictEqual([{ blockedUserId: userToBlock.id, blockingUserId: userThatBlocks.id }]);
	});

	test('like disappears after user has been blocked', async () => {
		const blockStatusAtStart = await checkBlockEntry(userToBlock.id, userThatBlocks.id);
		expect(blockStatusAtStart).toBeFalsy();

		await putLike(userToBlock, userThatBlocks);
		const likesByVisitor = await getLikesByVisitorId(userThatBlocks.id);
		expect(likesByVisitor).toBeTruthy();
		expect(likesByVisitor?.[0].likingUserId).toBe(userThatBlocks.id);

		const visitedStats = await checkLikesHistoryStats(userToBlock);
		expect(visitedStats).toStrictEqual([[{ likedUserId: userToBlock.id, likingUserId: userThatBlocks.id }], []]);

		const visitorStats = await checkLikesHistoryStats(userThatBlocks);
		expect(visitorStats).toStrictEqual([[], [{ likedUserId: userToBlock.id, likingUserId: userThatBlocks.id }]]);

		await userBlocksAnotherUser(userToBlock, userThatBlocks);

		const likesByVisitorAfterBlock = await getLikesByVisitorId(userThatBlocks.id);
		expect(likesByVisitorAfterBlock).toStrictEqual([]);

		const visitedStatsEnd = await checkLikesHistoryStats(userToBlock);
		expect(visitedStatsEnd).toStrictEqual([[], []]);

		const visitorStatsEnd = await checkLikesHistoryStats(userThatBlocks);
		expect(visitorStatsEnd).toStrictEqual([[], []]);
	});

	test('match disappears after user has been blocked', async () => {
		const blockStatusAtStart = await checkBlockEntry(userToBlock.id, userThatBlocks.id);
		expect(blockStatusAtStart).toBeFalsy();

		await twoUserLikeEachOther(userToBlock, userThatBlocks);

		await userBlocksAnotherUser(userToBlock, userThatBlocks);

		const match = await checkMatchEntry(userToBlock.id, userThatBlocks.id);
		expect(match).toBeFalsy();

		const firstUserStats = await checkMatchesStats(userToBlock);
		expect(firstUserStats).toStrictEqual([]);
		const secondUserStats = await checkMatchesStats(userThatBlocks);
		expect(secondUserStats).toStrictEqual([]);
	});

	test('blocked user can block back', async () => {
		const blockStatusAtStart = await checkBlockEntry(userToBlock.id, userThatBlocks.id);
		expect(blockStatusAtStart).toBeFalsy();

		await userBlocksAnotherUser(userToBlock, userThatBlocks);
		await userBlocksAnotherUser(userThatBlocks, userToBlock);

		const firtsUserStats = await checkBlocksStats(userToBlock);
		expect(firtsUserStats).toStrictEqual([{ blockedUserId: userThatBlocks.id, blockingUserId: userToBlock.id }]);
		const secondUserStats = await checkBlocksStats(userThatBlocks);
		expect(secondUserStats).toStrictEqual([{ blockedUserId: userToBlock.id, blockingUserId: userThatBlocks.id }]);
	});

	test('blocked user can still visit page of the one who blocked him', async () => {
		await userBlocksAnotherUser(userToBlock, userThatBlocks);

		const resFromProfilePage = await api
			.get(`/api/users/${userThatBlocks.id}/public_profile`)
			.set({ Authorization: `bearer ${userToBlock.token}` })
			.expect('Content-Type', /application\/json/);

		expect(resFromProfilePage.statusCode).toBe(200);
		expect(resFromProfilePage.body).toBeTruthy();
		//console.log(resFromProfilePage.text);

		expect(JSON.parse(resFromProfilePage.text)).toEqual({ ...infoProfilePublic, fameRating: baseFameRating + 1, id: userThatBlocks.id }); //1 point for visit
	});

	test('user can still visit page of the user whom he blocked', async () => {
		await userBlocksAnotherUser(userToBlock, userThatBlocks);

		const resFromProfilePage = await api
			.get(`/api/users/${userToBlock.id}/public_profile`)
			.set({ Authorization: `bearer ${userThatBlocks.token}` })
			.expect('Content-Type', /application\/json/);

		expect(resFromProfilePage.statusCode).toBe(200);
		expect(resFromProfilePage.body).toBeTruthy();
		//console.log(resFromProfilePage.text);

		expect(resFromProfilePage.text).toContain('lorem');
		expect(JSON.parse(resFromProfilePage.text)).toEqual({ ...infoProfilePublic2, fameRating: baseFameRating - 1, id: userToBlock.id }); // -2 point for block + 1 for visit = total -1
	});

	test('user can remove another user from his block list', async () => {
		await userBlocksAnotherUser(userToBlock, userThatBlocks);

		const secondUserStats = await checkBlocksStats(userThatBlocks);
		expect(secondUserStats).toStrictEqual([{ blockedUserId: userToBlock.id, blockingUserId: userThatBlocks.id }]);

		await removeBlockEntry(userToBlock.id, userThatBlocks.id);

		const blockStatusAtEnd = await checkBlockEntry(userToBlock.id, userThatBlocks.id);
		expect(blockStatusAtEnd).toBeFalsy();
		const secondUserStatsEnd = await checkBlocksStats(userThatBlocks);
		expect(secondUserStatsEnd).toStrictEqual([]);
	});
});
