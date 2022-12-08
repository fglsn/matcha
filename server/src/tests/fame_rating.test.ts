import { describe, expect } from '@jest/globals';
import { clearUsers, getFameRatingByUserId, increaseReportCount, updateFameRatingByUserId } from '../repositories/userRepository';
import { newUser, loginUser, secondUser, loginUser2, infoProfile } from './test_helper';
import {
	api,
	createAndLoginUser,
	getLocationMock,
	id,
	loginAndPrepareUser,
	loginRes,
	postToPhotos,
	putLike,
	putToProfile,
	removeLike,
	twoUserLikeEachOther,
	userBlocksAnotherUser,
	userReportsAnotherUser,
	userVisitsAnotherUsersProfile
} from './test_helper_fns';
import { clearLikes } from '../repositories/likesRepository';
import { checkBlockEntry, clearBlockEntries, removeBlockEntry } from '../repositories/blockEntriesRepository';
import { DataURL } from './test_helper_images';

jest.setTimeout(10000);
jest.mock('../services/location');

let userOne: { id: string; token: string };
let userTwo: { id: string; token: string };

describe('test user fame rating on onboarding (setting up profile)', () => {
	beforeEach(async () => {
		userOne = await createAndLoginUser(newUser);
	});

	test('user gets 40 points by default on registration', async () => {
		const fameRating = await getFameRatingByUserId(userOne.id);
		expect(fameRating).toBe(40);
	});

	test('user gets 1 point per one selected tag set in profile settings', async () => {
		let fameRating = await getFameRatingByUserId(userOne.id);
		expect(fameRating).toBe(40);

		getLocationMock.mockReturnValue(Promise.resolve('Helsinki, Finland'));
		await api
			.put(`/api/users/${userOne.id}/profile`)
			.set({ Authorization: `bearer ${userOne.token}` })
			.send({ ...infoProfile, tags: ['Sauna'] })
			.expect(200);

		fameRating = await getFameRatingByUserId(userOne.id);
		expect(fameRating).toBe(41);

		await putToProfile(userOne.id);

		fameRating = await getFameRatingByUserId(userOne.id);
		expect(fameRating).toBe(45);
	});

	test('user is losing 1 point when lowers amount of selected tags in profile settings', async () => {
		await putToProfile(userOne.id);

		let fameRating = await getFameRatingByUserId(userOne.id);
		expect(fameRating).toBe(45);

		await api
			.put(`/api/users/${userOne.id}/profile`)
			.set({ Authorization: `bearer ${userOne.token}` })
			.send({ ...infoProfile, tags: ['Sauna'] })
			.expect(200);

		fameRating = await getFameRatingByUserId(userOne.id);
		expect(fameRating).toBe(41);
	});

	test('user gets 2 points per one photo added to profile', async () => {
		let fameRating = await getFameRatingByUserId(userOne.id);
		expect(fameRating).toBe(40);

		await postToPhotos(userOne.id);

		fameRating = await getFameRatingByUserId(userOne.id);
		expect(fameRating).toBe(42);

		await api
			.post(`/api/users/${id}/photos`)
			.set({ Authorization: `bearer ${loginRes.body.token}` })
			.send({ images: [{ dataURL: DataURL }, { dataURL: DataURL }, { dataURL: DataURL }, { dataURL: DataURL }, { dataURL: DataURL }] })
			.expect(200);

		fameRating = await getFameRatingByUserId(userOne.id);
		expect(fameRating).toBe(50);
	});

	test('user lost 2 points after deleting a photo from profile', async () => {
		await api
			.post(`/api/users/${id}/photos`)
			.set({ Authorization: `bearer ${loginRes.body.token}` })
			.send({ images: [{ dataURL: DataURL }, { dataURL: DataURL }, { dataURL: DataURL }, { dataURL: DataURL }, { dataURL: DataURL }] })
			.expect(200);

		let fameRating = await getFameRatingByUserId(userOne.id);
		expect(fameRating).toBe(50);

		await api
			.post(`/api/users/${id}/photos`)
			.set({ Authorization: `bearer ${loginRes.body.token}` })
			.send({ images: [{ dataURL: DataURL }, { dataURL: DataURL }, { dataURL: DataURL }] })
			.expect(200);

		fameRating = await getFameRatingByUserId(userOne.id);
		expect(fameRating).toBe(46);
	});

	test('user has fame rating 55 on fully complete profile (5 tags 5 photos)', async () => {
		let fameRating = await getFameRatingByUserId(userOne.id);
		expect(fameRating).toBe(40);

		await putToProfile(userOne.id);
		await api
			.post(`/api/users/${id}/photos`)
			.set({ Authorization: `bearer ${loginRes.body.token}` })
			.send({ images: [{ dataURL: DataURL }, { dataURL: DataURL }, { dataURL: DataURL }, { dataURL: DataURL }, { dataURL: DataURL }] })
			.expect(200);

		fameRating = await getFameRatingByUserId(userOne.id);
		expect(fameRating).toBe(55);
	});
});

describe('test how actions are affecting fame rating', () => {
	beforeEach(async () => {
		await Promise.all([clearUsers(), clearLikes(), clearBlockEntries()]);
		userOne = await loginAndPrepareUser(newUser, loginUser);
		userTwo = await loginAndPrepareUser(secondUser, loginUser2);
	});

	test('user gets +1 point when new user visits his page', async () => {
		let fameRating = await getFameRatingByUserId(userOne.id);
		expect(fameRating).toBe(47);

		await userVisitsAnotherUsersProfile(userOne, userTwo);

		fameRating = await getFameRatingByUserId(userOne.id);
		expect(fameRating).toBe(48);
	});

	test('user doesnt get any additional points when another user opens his profile again', async () => {
		let fameRating = await getFameRatingByUserId(userOne.id);
		expect(fameRating).toBe(47);

		await userVisitsAnotherUsersProfile(userOne, userTwo);
		await userVisitsAnotherUsersProfile(userOne, userTwo);
		await userVisitsAnotherUsersProfile(userOne, userTwo);

		fameRating = await getFameRatingByUserId(userOne.id);
		expect(fameRating).toBe(48);
	});

	test('user gets +2 points when receives a new like', async () => {
		let fameRating = await getFameRatingByUserId(userOne.id);
		expect(fameRating).toBe(47);

		await putLike(userOne, userTwo);

		fameRating = await getFameRatingByUserId(userOne.id);
		expect(fameRating).toBe(49);
	});

	test('user lost -2 points wheh got a dislike (someone removed like)', async () => {
		await putLike(userOne, userTwo);

		let fameRating = await getFameRatingByUserId(userOne.id);
		expect(fameRating).toBe(49);

		await removeLike(userOne, userTwo);

		fameRating = await getFameRatingByUserId(userOne.id);
		expect(fameRating).toBe(47);
	});

	test('user lost -2 points wheh someone blocked him', async () => {
		let fameRating = await getFameRatingByUserId(userOne.id);
		expect(fameRating).toBe(47);

		await userBlocksAnotherUser(userOne, userTwo);

		fameRating = await getFameRatingByUserId(userOne.id);
		expect(fameRating).toBe(45);
	});

	test('user gets +2 point back wheh someone unblocked him', async () => {
		await userBlocksAnotherUser(userOne, userTwo);

		let fameRating = await getFameRatingByUserId(userOne.id);
		expect(fameRating).toBe(45);

		await removeBlockEntry(userOne.id, userTwo.id);
		const blockStatusAtEnd = await checkBlockEntry(userOne.id, userTwo.id);
		expect(blockStatusAtEnd).toBeFalsy();

		fameRating = await getFameRatingByUserId(userTwo.id);
		expect(fameRating).toBe(47);
	});

	test('user gets -5 points wheh someone reports him', async () => {
		let fameRating = await getFameRatingByUserId(userOne.id);
		expect(fameRating).toBe(47);

		await userReportsAnotherUser(userOne, userTwo);

		fameRating = await getFameRatingByUserId(userOne.id);
		expect(fameRating).toBe(42);
	});

	test('fame rating is set to 0 when account gets more than 10 fake reports', async () => {
		let reportCount;
		for (let i = 0; i < 10; i++) {
			reportCount = await increaseReportCount(userOne.id);
		}
		expect(reportCount).toBe(10);
		await userReportsAnotherUser(userOne, userTwo);
		const fameRating = await getFameRatingByUserId(userOne.id);
		expect(fameRating).toBe(0);
	});

	test('user recieves +2 points if matched with popular user (fame rating >= 75)', async () => {
		let fameRatingUserOne = await getFameRatingByUserId(userOne.id);
		expect(fameRatingUserOne).toBe(47);

		let fameRatingUserTwo = await getFameRatingByUserId(userTwo.id);
		expect(fameRatingUserTwo).toBe(47);
		fameRatingUserTwo = await updateFameRatingByUserId(userTwo.id, 30);
		expect(fameRatingUserTwo).toBe(77);

		await twoUserLikeEachOther(userOne, userTwo);

		fameRatingUserOne = await getFameRatingByUserId(userOne.id);
		expect(fameRatingUserOne).toBe(49);

		//stays same
		fameRatingUserTwo = await getFameRatingByUserId(userTwo.id);
		expect(fameRatingUserTwo).toBe(47);
	});

	test('user recieves -2 points if matched with unpopular user (fame rating <= 25)', async () => {
		let fameRatingUserOne = await getFameRatingByUserId(userOne.id);
		expect(fameRatingUserOne).toBe(47);

		let fameRatingUserTwo = await getFameRatingByUserId(userTwo.id);
		expect(fameRatingUserTwo).toBe(47);
		fameRatingUserTwo = await updateFameRatingByUserId(userTwo.id, -30);
		expect(fameRatingUserTwo).toBe(17);

		await twoUserLikeEachOther(userOne, userTwo);

		fameRatingUserOne = await getFameRatingByUserId(userOne.id);
		expect(fameRatingUserOne).toBe(45);

		//stays same
		fameRatingUserTwo = await getFameRatingByUserId(userTwo.id);
		expect(fameRatingUserTwo).toBe(47);
	});

	test('user recieves 0 points if matched with average user (fame rating > 25 && fame rating < 75 )', async () => {
		let fameRatingUserOne = await getFameRatingByUserId(userOne.id);
		expect(fameRatingUserOne).toBe(47);

		let fameRatingUserTwo = await getFameRatingByUserId(userTwo.id);
		expect(fameRatingUserTwo).toBe(47);

		await twoUserLikeEachOther(userOne, userTwo);

		fameRatingUserOne = await getFameRatingByUserId(userOne.id);
		expect(fameRatingUserOne).toBe(47);

		fameRatingUserTwo = await getFameRatingByUserId(userTwo.id);
		expect(fameRatingUserTwo).toBe(47);
	});
});
