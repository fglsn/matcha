/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { describe } from '@jest/globals';
import { clearUsers } from '../repositories/userRepository';
import { getAge, getDistance } from '../utils/helpers';
import { TokenAndId } from './test_helper';
import { api, loginAndPrepareUser, putLike, twoUserLikeEachOther, userBlocksAnotherUser, userReportsAnotherUser } from './test_helper_fns';
import {
	newUser,
	secondUser,
	user3,
	user4,
	user5,
	user6,
	user7,
	profileDataNewUser,
	profileDataSecondUser,
	profileData3,
	profileData4,
	profileData5,
	profileData6,
	profileData7,
	credentialsNewUser,
	credentialsSecondUser,
	credentials4,
	credentials5,
	credentials3,
	credentials6,
	credentials7,
	publicProfile7,
	publicProfile5,
	publicProfile4,
	publicProfile3,
	profileData10,
	profileData8,
	profileData9,
	user10,
	user8,
	user9,
	credentials10,
	credentials8,
	credentials9,
	publicProfile10,
	publicProfile8,
	publicProfile2,
	publicProfile1,
	publicProfile9,
	publicProfile6
} from './test_helper_users';

jest.setTimeout(15000);
jest.mock('../services/location');

let userOne: { id: string; token: string };
let userTwo: { id: string; token: string };
let userThree: { id: string; token: string };
let userFour: { id: string; token: string };
let userFive: { id: string; token: string };
let userSix: { id: string; token: string };
let userSeven: { id: string; token: string };
let userEight: { id: string; token: string };
let userNine: { id: string; token: string };
let userTen: { id: string; token: string };

const defaultSortAndFilterCriterias = {
	sort: { sort: 'distance', order: 'asc' },
	filter: [
		{ filter: 'distance', min: 2, max: 50 },
		{ filter: 'age', min: 18, max: 80 },
		{ filter: 'rating', min: 0, max: 100 },
		{ filter: 'tags', min: 0, max: 5 }
	]
};

const prepareUsers = async () => {
	await clearUsers();
	userOne = await loginAndPrepareUser(newUser, credentialsNewUser, profileDataNewUser); //male straight - matcha - def coords
	userTwo = await loginAndPrepareUser(secondUser, credentialsSecondUser, profileDataSecondUser); //male gay - matcha2 - def coords
	userThree = await loginAndPrepareUser(user3, credentials3, profileData3); //male gay - matcha3 - 795km from def coords
	userFour = await loginAndPrepareUser(user4, credentials4, profileData4); //male bi - matcha4 - 6km
	userFive = await loginAndPrepareUser(user5, credentials5, profileData5); //female straight - matcha5 - 17km
	userSix = await loginAndPrepareUser(user6, credentials6, profileData6); //female gay - matcha6 - 94km
	userSeven = await loginAndPrepareUser(user7, credentials7, profileData7); //female bi - matcha7 - 2km
	userEight = await loginAndPrepareUser(user8, credentials8, profileData8); //male bi
	userNine = await loginAndPrepareUser(user9, credentials9, profileData9); //female gay
	userTen = await loginAndPrepareUser(user10, credentials10, profileData10); //female bi
};

const getSearchPage = async (user: TokenAndId) => {
	const res = await api
		.post(`/api/users/match_suggestions`)
		.set({ Authorization: `bearer ${user.token}` })
		.send(defaultSortAndFilterCriterias)
		.expect('Content-Type', /application\/json/);

	expect(res.statusCode).toBe(200);
	expect(res.body).toBeTruthy();
	// console.log(res.body);
	return res.body;
};
describe('test initial match suggestions', () => {
	describe('suggestions by sex preferences and default filter distance < 50km, limited by 4 profiles', () => {
		beforeAll(async () => {
			await prepareUsers();
		});

		test('logged user can visit search page', async () => {
			await getSearchPage(userOne);
		});

		test('male straight user sees only female straight and female bi', async () => {
			const searchResult = await getSearchPage(userOne);
			expect(searchResult).toEqual([
				{
					...publicProfile7,
					id: userSeven.id,
					age: getAge(profileData7.birthday),
					distance: getDistance(profileDataNewUser.coordinates, profileData7.coordinates) //2
				},
				{
					...publicProfile5,
					id: userFive.id,
					age: getAge(profileData5.birthday),
					distance: getDistance(profileDataNewUser.coordinates, profileData5.coordinates) //17
				},
				{
					...publicProfile10,
					id: userTen.id,
					age: getAge(profileData10.birthday),
					distance: getDistance(profileDataNewUser.coordinates, profileData10.coordinates) //17
				}
			]);
		});

		test('male gay user sees only male gay and male bi', async () => {
			const searchResult = await getSearchPage(userTwo);
			expect(searchResult).toEqual([
				{
					...publicProfile8,
					id: userEight.id,
					age: getAge(profileData8.birthday),
					distance: getDistance(profileDataSecondUser.coordinates, profileData8.coordinates) //2
				},
				{
					...publicProfile4,
					id: userFour.id,
					age: getAge(profileData4.birthday),
					distance: getDistance(profileDataSecondUser.coordinates, profileData4.coordinates) //6
				},
				{
					...publicProfile3,
					id: userThree.id,
					age: getAge(profileData3.birthday),
					distance: getDistance(profileDataSecondUser.coordinates, profileData3.coordinates) //10
				}
			]);
		});

		test('male bi user sees male gay and male bi, female straight, female bi', async () => {
			const searchResult = await getSearchPage(userFour); //#2 3 5 7 8 10
			//console.log(searchResult);
			expect(searchResult).toEqual([
				{
					...publicProfile8,
					id: userEight.id,
					age: getAge(profileData8.birthday),
					distance: getDistance(profileData4.coordinates, profileData8.coordinates) //5
				},
				{
					...publicProfile7,
					id: userSeven.id,
					age: getAge(profileData7.birthday),
					distance: getDistance(profileData4.coordinates, profileData7.coordinates) //5
				},
				{
					...publicProfile2,
					id: userTwo.id,
					age: getAge(profileDataSecondUser.birthday),
					distance: getDistance(profileData4.coordinates, profileDataSecondUser.coordinates) //6
				},
				{
					...publicProfile3,
					id: userThree.id,
					age: getAge(profileData3.birthday),
					distance: getDistance(profileData4.coordinates, profileData3.coordinates) //10
				}
				// {
				// 	...publicProfile5,
				// 	id: userFive.id,
				// 	age: getAge(profileData5.birthday),
				// 	distance: getDistance(profileData4.coordinates, profileData5.coordinates) //12
				// },
				// {
				// 	...publicProfile10,
				// 	id: userTen.id,
				// 	age: getAge(profileData10.birthday),
				// 	distance: getDistance(profileData4.coordinates, profileData10.coordinates) //12
				// }
			]);
		});

		test('female straight user sees only male straight and male bi', async () => {
			const searchResult = await getSearchPage(userFive); // # 1 4 8
			//console.log(searchResult);
			expect(searchResult).toEqual([
				{
					...publicProfile4,
					id: userFour.id,
					age: getAge(profileData4.birthday),
					distance: getDistance(profileData5.coordinates, profileData4.coordinates) //11
				},
				{
					...publicProfile1,
					id: userOne.id,
					age: getAge(profileDataNewUser.birthday),
					distance: getDistance(profileData5.coordinates, profileDataNewUser.coordinates) //16
				},
				{
					...publicProfile8,
					id: userEight.id,
					age: getAge(profileData8.birthday),
					distance: getDistance(profileData5.coordinates, profileData8.coordinates) //16
				}
			]);
		});

		test('female gay user sees only female gay and female bi', async () => {
			const searchResult = await getSearchPage(userSix); // # 7 9 10
			expect(searchResult).toEqual([
				{
					...publicProfile9,
					id: userNine.id,
					age: getAge(profileData9.birthday),
					distance: getDistance(profileData6.coordinates, profileData9.coordinates) //20
				},
				{
					...publicProfile10,
					id: userTen.id,
					age: getAge(profileData10.birthday),
					distance: getDistance(profileData6.coordinates, profileData10.coordinates) //20
				},
				{
					...publicProfile7,
					id: userSeven.id,
					age: getAge(profileData7.birthday),
					distance: getDistance(profileData6.coordinates, profileData7.coordinates) //29
				}
			]);
		});

		test('female bi user sees female gay and female bi, male straight, male bi', async () => {
			const searchResult = await getSearchPage(userSeven); //# 1 6 8 9 10 4
			//console.log(searchResult);
			expect(searchResult).toEqual([
				{
					...publicProfile1,
					id: userOne.id,
					age: getAge(profileDataNewUser.birthday),
					distance: getDistance(profileData7.coordinates, profileDataNewUser.coordinates) //2
				},
				{
					...publicProfile4,
					id: userFour.id,
					age: getAge(profileData4.birthday),
					distance: getDistance(profileData7.coordinates, profileData4.coordinates) //5
				},
				{
					...publicProfile6,
					id: userSix.id,
					age: getAge(profileData6.birthday),
					distance: getDistance(profileData7.coordinates, profileData6.coordinates) //92
				},
				{
					...publicProfile10,
					id: userTen.id,
					age: getAge(profileData10.birthday),
					distance: getDistance(profileData7.coordinates, profileData10.coordinates) //17
				}
				// {
				// 	...publicProfile9,
				// 	id: userNine.id,
				// 	age: getAge(profileData9.birthday),
				// 	distance: getDistance(profileData7.coordinates, profileData9.coordinates) //92
				// }
			]);
		});
	});

	describe('suggestions by actions', () => {
		beforeEach(async () => {
			await prepareUsers();
		});

		test('liked users are not in the search results', async () => {
			const res: TokenAndId[] = await getSearchPage(userOne);
			const userToLike = res[0];

			await putLike(userToLike, userOne);

			const resAfterLike: TokenAndId[] = await getSearchPage(userOne);
			// console.log(resAfterLike);
			expect(resAfterLike).not.toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						id: userToLike.id
					})
				])
			);
		});

		test('matched users are not in the search results', async () => {
			const firstGetResultUserOne: TokenAndId[] = await getSearchPage(userOne);
			expect(firstGetResultUserOne).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						id: userSeven.id
					})
				])
			);

			const firstGetResultUserTwo: TokenAndId[] = await getSearchPage(userSeven);
			expect(firstGetResultUserTwo).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						id: userOne.id
					})
				])
			);

			await twoUserLikeEachOther(userSeven, userOne);

			const secondGetResultUserOne: TokenAndId[] = await getSearchPage(userOne);
			expect(secondGetResultUserOne).not.toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						id: userSeven.id
					})
				])
			);

			const secondGetResultUserTwo: TokenAndId[] = await getSearchPage(userSeven);
			expect(secondGetResultUserTwo).not.toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						id: userOne.id
					})
				])
			);
		});

		test('blocked users are not in the search results', async () => {
			const res: TokenAndId[] = await getSearchPage(userOne);
			expect(res).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						id: userSeven.id
					})
				])
			);

			await userBlocksAnotherUser(userSeven, userOne);

			const resAfterBlock: TokenAndId[] = await getSearchPage(userOne);
			expect(resAfterBlock).not.toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						id: userSeven.id
					})
				])
			);
		});

		test('reported users are not in the search results', async () => {
			const res: TokenAndId[] = await getSearchPage(userOne);
			expect(res).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						id: userSeven.id
					})
				])
			);

			await userReportsAnotherUser(userSeven, userOne);

			const resAfterBlock: TokenAndId[] = await getSearchPage(userOne);
			expect(resAfterBlock).not.toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						id: userSeven.id
					})
				])
			);
		});
	});
});
