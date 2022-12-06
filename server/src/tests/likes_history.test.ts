/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { describe, expect } from '@jest/globals';
import { clearUsers } from '../repositories/userRepository';
import { newUser, loginUser, secondUser, loginUser2, defaultCoordinates, ipAddress } from './test_helper';
import { api, initLoggedUser, loginAndPrepareUser, putLike, removeLike, requestCoordinatesByIpMock } from './test_helper_fns';
import { checkLikeEntry, clearLikes, getLikesByVisitedId, getLikesCount } from '../repositories/likesRepository';
import { createNewUser } from '../services/users';

jest.setTimeout(10000);
jest.mock('../services/location');

let visitor: { id: string; token: string };
let visited: { id: string; token: string };

describe('like history tests', () => {
	beforeEach(async () => {
		await clearUsers();
		await clearLikes();
		visitor = await loginAndPrepareUser(newUser, loginUser);
		visited = await loginAndPrepareUser(secondUser, loginUser2);
	});

	test('like value is false on GET when no like from visitor on visited profile', async () => {
		const res = await api
			.get(`/api/users/${visited.id}/like`)
			.set({ Authorization: `bearer ${visitor.token}` })
			.expect(200)
			.expect('Content-Type', /application\/json/);

		expect(res.body.like).toBeFalsy();
	});

	test('valid user can like another valid user', async () => {
		const likeStatusAtStart = await checkLikeEntry(visited.id, visitor.id);
		expect(likeStatusAtStart).toBeFalsy();

		await putLike(visited, visitor);

		const likeStatusAtEnd = await checkLikeEntry(visited.id, visitor.id);
		expect(likeStatusAtEnd).toBeTruthy();
		const likesByVisited = await getLikesByVisitedId(visited.id);
		expect(likesByVisited).toBeDefined();
		expect(likesByVisited?.[0].likingUserId).toBe(visitor.id);
	});

	test('like value is true on GET when visitor already liked visited profile', async () => {
		await putLike(visited, visitor);

		const res = await api
			.get(`/api/users/${visited.id}/like`)
			.set({ Authorization: `bearer ${visitor.token}` })
			.expect(200)
			.expect('Content-Type', /application\/json/);

		expect(res.body.like).toBeTruthy();
	});

	test('user can like another user only once', async () => {
		const likeStatusAtStart = await checkLikeEntry(visited.id, visitor.id);
		expect(likeStatusAtStart).toBeFalsy();

		await putLike(visited, visitor);

		const likesCountAfterLike = await getLikesCount(visited.id);
		expect(likesCountAfterLike).toBe(1);

		const likeStatusAtEnd = await checkLikeEntry(visited.id, visitor.id);
		expect(likeStatusAtEnd).toBeTruthy();

		await putLike(visited, visitor);
		await putLike(visited, visitor);

		const likesCountAtEnd = await getLikesCount(visited.id);
		expect(likesCountAtEnd).toBe(1);
	});

	test('user can remove a like that he put to another user', async () => {
		const likeStatusAtStart = await checkLikeEntry(visited.id, visitor.id);
		expect(likeStatusAtStart).toBeFalsy();

		await putLike(visited, visitor);

		const likeStatus = await checkLikeEntry(visited.id, visitor.id);
		expect(likeStatus).toBeTruthy();

		const likesByVisited = await getLikesByVisitedId(visited.id);
		expect(likesByVisited).toBeDefined();
		expect(likesByVisited?.[0].likingUserId).toBe(visitor.id);

		await removeLike(visited, visitor);
		const likeStatusAtEnd = await checkLikeEntry(visited.id, visitor.id);
		expect(likeStatusAtEnd).toBeFalsy();
	});

	test('no errors if user sends request to remove like that wasnt there', async () => {
		const likeStatus = await checkLikeEntry(visited.id, visitor.id);
		expect(likeStatus).toBeFalsy();

		await removeLike(visited, visitor);
		const likeStatusAtEnd = await checkLikeEntry(visited.id, visitor.id);
		expect(likeStatusAtEnd).toBeFalsy();
	});

	test('user can like, then remove like and like again', async () => {
		const likeStatusAtStart = await checkLikeEntry(visited.id, visitor.id);
		expect(likeStatusAtStart).toBeFalsy();

		await putLike(visited, visitor);
		const likeStatus = await checkLikeEntry(visited.id, visitor.id);
		expect(likeStatus).toBeTruthy();

		await removeLike(visited, visitor);
		const likeStatusAfterRemove = await checkLikeEntry(visited.id, visitor.id);
		expect(likeStatusAfterRemove).toBeFalsy();

		await putLike(visited, visitor);
		const likeStatusAtEnd = await checkLikeEntry(visited.id, visitor.id);
		expect(likeStatusAtEnd).toBeTruthy();
	});
});

describe('like fails on non-valid users', () => {
	beforeEach(async () => {
		await clearUsers();
		await clearLikes();
	});

	test('fails if user profile that tries to put like is not complete', async () => {
		requestCoordinatesByIpMock.mockReturnValue(Promise.resolve(defaultCoordinates));
		await createNewUser(newUser, ipAddress);
		const loginRes = await initLoggedUser(newUser.username, loginUser);
		const id = <string>JSON.parse(loginRes.text).id;
		const token = loginRes.body.token;

		visited = await loginAndPrepareUser(secondUser, loginUser2);
		const likeStatusAtStart = await checkLikeEntry(visited.id, id);
		expect(likeStatusAtStart).toBeFalsy();

		const res = await api
			.post(`/api/users/${visited.id}/like`)
			.set({ Authorization: `bearer ${token}` })
			.expect(400)
			.expect('Content-Type', /application\/json/);

		// console.log(res.body.error);
		expect(res.body.error).toContain('Please, complete your own profile first');

		const likeStatusAtEnd = await checkLikeEntry(visited.id, id);
		expect(likeStatusAtEnd).toBeFalsy();
		const likesByVisited = await getLikesByVisitedId(visited.id);
		expect(likesByVisited).not.toBeDefined();
	});

	test('fails if user profile that is getting a like id not complete', async () => {
		visitor = await loginAndPrepareUser(secondUser, loginUser2);

		requestCoordinatesByIpMock.mockReturnValue(Promise.resolve(defaultCoordinates));
		await createNewUser(newUser, ipAddress);
		const loginRes = await initLoggedUser(newUser.username, loginUser);
		const id = <string>JSON.parse(loginRes.text).id;

		const likeStatusAtStart = await checkLikeEntry(id, visitor.id);
		expect(likeStatusAtStart).toBeFalsy();

		const res = await api
			.post(`/api/users/${id}/like`)
			.set({ Authorization: `bearer ${visitor.token}` })
			.expect(400)
			.expect('Content-Type', /application\/json/);

		// console.log(res.body.error);
		expect(res.body.error).toContain('Profile you are looking for is not complete. Try again later!');

		const likeStatusAtEnd = await checkLikeEntry(id, visitor.id);
		expect(likeStatusAtEnd).toBeFalsy();
		const likesByVisited = await getLikesByVisitedId(id);
		expect(likesByVisited).not.toBeDefined();
	});
});
