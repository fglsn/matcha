import { describe, expect } from '@jest/globals';
//prettier-ignore
import { DataURL } from './test_helper_images';
import { api, createAndLoginUser, getLocationMock, id, loginAndPrepareUser, loginRes, postToPhotos, putLike, putToProfile, removeLike, twoUserLikeEachOther, userBlocksAnotherUser, userReportsAnotherUser, userVisitsAnotherUsersProfile } from './test_helper_fns';
import { newUser, credentialsNewUser, profileDataNewUser, secondUser, credentialsSecondUser, profileDataSecondUser } from './test_helper_users';
import { clearUsers, getFameRatingByUserId, increaseReportCount, updateFameRatingByUserId } from '../repositories/userRepository';
import { checkBlockEntry, clearBlockEntries } from '../repositories/blockEntriesRepository';
import { clearLikes } from '../repositories/likesRepository';

jest.setTimeout(10000);
jest.mock('../services/location');

let userOne: { id: string; token: string };
let userTwo: { id: string; token: string };

const defaultFameRating = 40;
describe('test user fame rating on onboarding (setting up profile)', () => {
	beforeEach(async () => {
		userOne = await createAndLoginUser(newUser);
	});

	test('user gets 40 points by default on registration', async () => {
		const fameRating = await getFameRatingByUserId(userOne.id);
		expect(fameRating).toBe(defaultFameRating);
	});

	test('user gets 1 point per one selected tag set in profile settings', async () => {
		let fameRating = await getFameRatingByUserId(userOne.id);
		expect(fameRating).toBe(defaultFameRating);

		getLocationMock.mockReturnValue(Promise.resolve('Helsinki, Finland'));
		await api
			.put(`/api/users/${userOne.id}/profile`)
			.set({ Authorization: `bearer ${userOne.token}` })
			.send({ ...profileDataNewUser, tags: ['Sauna'] })
			.expect(200);

		fameRating = await getFameRatingByUserId(userOne.id);
		expect(fameRating).toBe(defaultFameRating + 1);

		//5 tags added here
		await putToProfile(userOne.id);

		fameRating = await getFameRatingByUserId(userOne.id);
		expect(fameRating).toBe(defaultFameRating + 5);
	});

	test('user is losing 1 point when lowers amount of selected tags in profile settings', async () => {
		await putToProfile(userOne.id); //5 tags added here

		let fameRating = await getFameRatingByUserId(userOne.id);
		expect(fameRating).toBe(defaultFameRating + 5);

		await api
			.put(`/api/users/${userOne.id}/profile`)
			.set({ Authorization: `bearer ${userOne.token}` })
			.send({ ...profileDataNewUser, tags: ['Sauna'] }) //one tag
			.expect(200);

		fameRating = await getFameRatingByUserId(userOne.id);
		expect(fameRating).toBe(defaultFameRating + 1);
	});

	test('user gets 2 points per one photo added to profile', async () => {
		let fameRating = await getFameRatingByUserId(userOne.id);
		expect(fameRating).toBe(defaultFameRating);

		// one photo added
		await postToPhotos(userOne.id);

		fameRating = await getFameRatingByUserId(userOne.id);
		expect(fameRating).toBe(defaultFameRating + 2);

		await api
			.post(`/api/users/${id}/photos`)
			.set({ Authorization: `bearer ${loginRes.body.token}` })
			.send({ images: [{ dataURL: DataURL }, { dataURL: DataURL }, { dataURL: DataURL }, { dataURL: DataURL }, { dataURL: DataURL }] })
			.expect(200);

		fameRating = await getFameRatingByUserId(userOne.id);
		expect(fameRating).toBe(defaultFameRating + 10);
	});

	test('user lost 2 points after deleting a photo from profile', async () => {
		await api
			.post(`/api/users/${id}/photos`)
			.set({ Authorization: `bearer ${loginRes.body.token}` })
			.send({ images: [{ dataURL: DataURL }, { dataURL: DataURL }, { dataURL: DataURL }, { dataURL: DataURL }, { dataURL: DataURL }] })
			.expect(200);

		let fameRating = await getFameRatingByUserId(userOne.id);
		expect(fameRating).toBe(defaultFameRating + 10);

		await api
			.post(`/api/users/${id}/photos`)
			.set({ Authorization: `bearer ${loginRes.body.token}` })
			.send({ images: [{ dataURL: DataURL }, { dataURL: DataURL }, { dataURL: DataURL }] })
			.expect(200);

		fameRating = await getFameRatingByUserId(userOne.id);
		expect(fameRating).toBe(defaultFameRating + 6);
	});

	test('user has fame rating 55 on fully complete profile (5 tags 5 photos)', async () => {
		let fameRating = await getFameRatingByUserId(userOne.id);
		expect(fameRating).toBe(defaultFameRating);

		await putToProfile(userOne.id);
		await api
			.post(`/api/users/${id}/photos`)
			.set({ Authorization: `bearer ${loginRes.body.token}` })
			.send({ images: [{ dataURL: DataURL }, { dataURL: DataURL }, { dataURL: DataURL }, { dataURL: DataURL }, { dataURL: DataURL }] })
			.expect(200);

		fameRating = await getFameRatingByUserId(userOne.id);
		expect(fameRating).toBe(defaultFameRating + 5 + 10);
	});
});

describe('test how actions are affecting fame rating', () => {
	beforeEach(async () => {
		await Promise.all([clearUsers(), clearLikes(), clearBlockEntries()]);
		userOne = await loginAndPrepareUser(newUser, credentialsNewUser, profileDataNewUser);
		userTwo = await loginAndPrepareUser(secondUser, credentialsSecondUser, profileDataSecondUser);
	});

	test('fame rating stays the same when user visits his own profile', async () => {
		const fameRating = await getFameRatingByUserId(userOne.id);
		expect(fameRating).toBe(defaultFameRating + 7);

		const resFromProfilePage = await api
			.get(`/api/users/${userOne.id}/public_profile`)
			.set({ Authorization: `bearer ${userOne.token}` })
			.expect('Content-Type', /application\/json/);

		expect(resFromProfilePage.statusCode).toBe(200);
		expect(resFromProfilePage.body).toBeTruthy();

		const fameRatingNew = await getFameRatingByUserId(userOne.id);
		expect(fameRatingNew).toBe(fameRating);
	});

	test('user gets +1 point when new user visits his page', async () => {
		const fameRating = await getFameRatingByUserId(userOne.id);
		expect(fameRating).toBe(defaultFameRating + 7);

		await userVisitsAnotherUsersProfile(userOne, userTwo);

		const fameRatingNew = await getFameRatingByUserId(userOne.id);
		expect(fameRatingNew).toBe(fameRating + 1);
	});

	test('user doesnt get any additional points when another user opens his profile multiple times', async () => {
		const fameRating = await getFameRatingByUserId(userOne.id);
		expect(fameRating).toBe(defaultFameRating + 7);

		await userVisitsAnotherUsersProfile(userOne, userTwo);
		await userVisitsAnotherUsersProfile(userOne, userTwo);
		await userVisitsAnotherUsersProfile(userOne, userTwo);

		const fameRatingNew = await getFameRatingByUserId(userOne.id);
		expect(fameRatingNew).toBe(fameRating + 1);
	});

	test('user gets +2 points when receives a new like', async () => {
		const fameRating = await getFameRatingByUserId(userOne.id);
		expect(fameRating).toBe(defaultFameRating + 7);

		await putLike(userOne, userTwo);

		const fameRatingNew = await getFameRatingByUserId(userOne.id);
		expect(fameRatingNew).toBe(fameRating + 2);
	});

	test('user lost -2 points wheh got a dislike (someone removed like)', async () => {
		await putLike(userOne, userTwo);

		const fameRating = await getFameRatingByUserId(userOne.id);
		expect(fameRating).toBe(defaultFameRating + 7 + 2);

		await removeLike(userOne, userTwo);

		const fameRatingNew = await getFameRatingByUserId(userOne.id);
		expect(fameRatingNew).toBe(fameRating - 2);
	});

	test('user lost -2 points wheh someone blocked him', async () => {
		const fameRating = await getFameRatingByUserId(userOne.id);
		expect(fameRating).toBe(defaultFameRating + 7);

		await userBlocksAnotherUser(userOne, userTwo);

		const fameRatingNew = await getFameRatingByUserId(userOne.id);
		expect(fameRatingNew).toBe(fameRating - 2);
	});

	test('user gets +2 point back wheh someone unblocked him', async () => {
		await userBlocksAnotherUser(userOne, userTwo);

		const fameRating = await getFameRatingByUserId(userOne.id);
		expect(fameRating).toBe(defaultFameRating + 7 - 2);

		await api
			.delete(`/api/users/${userOne.id}/block`)
			.set({ Authorization: `bearer ${userTwo.token}` })
			.expect(200);

		const blockStatusAtEnd = await checkBlockEntry(userOne.id, userTwo.id);
		expect(blockStatusAtEnd).toBeFalsy();

		const fameRatingNew = await getFameRatingByUserId(userOne.id);
		expect(fameRatingNew).toBe(fameRating + 2);
	});

	test('user gets -5 points wheh someone reports him', async () => {
		const fameRating = await getFameRatingByUserId(userOne.id);
		expect(fameRating).toBe(defaultFameRating + 7);

		await userReportsAnotherUser(userOne, userTwo);

		const fameRatingNew = await getFameRatingByUserId(userOne.id);
		expect(fameRatingNew).toBe(fameRating - 5);
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

		//received 2 for like and 2 for match
		fameRatingUserOne = await getFameRatingByUserId(userOne.id);
		expect(fameRatingUserOne).toBe(51);

		//received 2 for like
		fameRatingUserTwo = await getFameRatingByUserId(userTwo.id);
		expect(fameRatingUserTwo).toBe(79);
	});

	test('user recieves -2 points if matched with unpopular user (fame rating <= 25)', async () => {
		let fameRatingUserOne = await getFameRatingByUserId(userOne.id);
		expect(fameRatingUserOne).toBe(47);

		let fameRatingUserTwo = await getFameRatingByUserId(userTwo.id);
		expect(fameRatingUserTwo).toBe(47);
		fameRatingUserTwo = await updateFameRatingByUserId(userTwo.id, -30);
		expect(fameRatingUserTwo).toBe(17);

		await twoUserLikeEachOther(userOne, userTwo);

		//gets +2 for like
		fameRatingUserOne = await getFameRatingByUserId(userOne.id);
		expect(fameRatingUserOne).toBe(47);

		//gets +2 for like
		fameRatingUserTwo = await getFameRatingByUserId(userTwo.id);
		expect(fameRatingUserTwo).toBe(19);
	});

	test('user recieves 0 points if matched with average user (fame rating > 25 && fame rating < 75 )', async () => {
		let fameRatingUserOne = await getFameRatingByUserId(userOne.id);
		expect(fameRatingUserOne).toBe(47);

		let fameRatingUserTwo = await getFameRatingByUserId(userTwo.id);
		expect(fameRatingUserTwo).toBe(47);

		await twoUserLikeEachOther(userOne, userTwo);

		//gets +2 for likes tho
		fameRatingUserOne = await getFameRatingByUserId(userOne.id);
		expect(fameRatingUserOne).toBe(49);

		//gets +2 for likes tho
		fameRatingUserTwo = await getFameRatingByUserId(userTwo.id);
		expect(fameRatingUserTwo).toBe(49);
	});
});
