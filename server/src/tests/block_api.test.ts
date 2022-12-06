/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { describe, expect } from '@jest/globals';
import { clearUsers } from '../repositories/userRepository';
import { newUser, loginUser, secondUser, loginUser2, infoProfilePublic, infoProfilePublic2 } from './test_helper';
import { api, loginAndPrepareUser, putLike, twoUserLikeEachOther, userBlocksAnotherUser } from './test_helper_fns';
import { clearLikes, getLikesByVisitorId } from '../repositories/likesRepository';
import { checkMatchEntry } from '../repositories/matchesRepository';
import { checkBlockEntry, removeBlockEntry } from '../repositories/blockEntriesRepository';

jest.setTimeout(10000);
jest.mock('../services/location');

let userThatBlocks: { id: string; token: string };
let userToBlock: { id: string; token: string };

describe('test block user functionality', () => {
	beforeEach(async () => {
		await clearUsers();
		await clearLikes();
		userThatBlocks = await loginAndPrepareUser(newUser, loginUser);
		userToBlock = await loginAndPrepareUser(secondUser, loginUser2);
	});

	test('user can block another user', async () => {
		const blockStatusAtStart = await checkBlockEntry(userToBlock.id, userThatBlocks.id);
		expect(blockStatusAtStart).toBeFalsy();

		await userBlocksAnotherUser(userToBlock, userThatBlocks);
	});

	test('like disappears after user has been blocked', async () => {
		const blockStatusAtStart = await checkBlockEntry(userToBlock.id, userThatBlocks.id);
		expect(blockStatusAtStart).toBeFalsy();

		await putLike(userToBlock, userThatBlocks);
		const likesByVisitor = await getLikesByVisitorId(userThatBlocks.id);
		expect(likesByVisitor).toBeDefined();
		expect(likesByVisitor?.[0].likingUserId).toBe(userThatBlocks.id);

		await userBlocksAnotherUser(userToBlock, userThatBlocks);

		const likesByVisitorAfterBlock = await getLikesByVisitorId(userThatBlocks.id);
		expect(likesByVisitorAfterBlock).not.toBeDefined();
	});

	test('match disappears after user has been blocked', async () => {
		const blockStatusAtStart = await checkBlockEntry(userToBlock.id, userThatBlocks.id);
		expect(blockStatusAtStart).toBeFalsy();

		await twoUserLikeEachOther(userToBlock, userThatBlocks);

		await userBlocksAnotherUser(userToBlock, userThatBlocks);

		const match = await checkMatchEntry(userToBlock.id, userThatBlocks.id);
		expect(match).toBeFalsy();
	});

	test('blocked user can block back', async () => {
		const blockStatusAtStart = await checkBlockEntry(userToBlock.id, userThatBlocks.id);
		expect(blockStatusAtStart).toBeFalsy();

		await userBlocksAnotherUser(userToBlock, userThatBlocks);
		await userBlocksAnotherUser(userThatBlocks, userToBlock);
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

		expect(JSON.parse(resFromProfilePage.text)).toEqual({ ...infoProfilePublic, id: userThatBlocks.id });
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
		expect(JSON.parse(resFromProfilePage.text)).toEqual({ ...infoProfilePublic2, id: userToBlock.id });
	});

	test('user can remove another user from his block list', async () => {
		await userBlocksAnotherUser(userToBlock, userThatBlocks);

		await removeBlockEntry(userToBlock.id, userThatBlocks.id);
		const blockStatusAtEnd = await checkBlockEntry(userToBlock.id, userThatBlocks.id);
		expect(blockStatusAtEnd).toBeFalsy();
	});
});
