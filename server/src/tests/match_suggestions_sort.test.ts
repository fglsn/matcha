/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { describe } from '@jest/globals';
import { clearUsers } from '../repositories/userRepository';
import { Criterias, FilterCriteria, Order, SortingCriteria } from '../types';
import { TokenAndId } from './test_helper';
import { api, loginAndPrepareUser } from './test_helper_fns';
import {
	newUser,
	user4,
	user5,
	user6,
	user7,
	profileDataNewUser,
	profileData4,
	profileData5,
	profileData6,
	profileData7,
	credentialsNewUser,
	credentials4,
	credentials5,
	credentials6,
	credentials7,
	profileData10,
	profileData9,
	user10,
	user9,
	credentials10,
	credentials9
} from './test_helper_users';

jest.setTimeout(15000);
jest.mock('../services/location');

let requestor: { id: string; token: string };
// let userOne: { id: string; token: string };
// let userFour: { id: string; token: string };
// let userFive: { id: string; token: string };
// let userSix: { id: string; token: string };
// let userNine: { id: string; token: string };
// let userTen: { id: string; token: string };

const sortByDistance: { sort: Criterias; order: Order } = { sort: 'distance', order: 'asc' };
const sortByDistanceReversed: { sort: Criterias; order: Order } = { sort: 'distance', order: 'desc' };

const sortByAge: { sort: Criterias; order: Order } = { sort: 'age', order: 'asc' };
const sortByAgeReversed: { sort: Criterias; order: Order } = { sort: 'age', order: 'desc' };

const sortByTags: { sort: Criterias; order: Order } = { sort: 'tags', order: 'desc' };
const sortByTagsReversed: { sort: Criterias; order: Order } = { sort: 'tags', order: 'asc' };

const sortByRating: { sort: Criterias; order: Order } = { sort: 'rating', order: 'desc' };
const sortByRatingReversed: { sort: Criterias; order: Order } = { sort: 'rating', order: 'asc' };

const filter: FilterCriteria[] = [
	{ filter: 'distance', min: 2, max: 50 },
	{ filter: 'age', min: 18, max: 80 },
	{ filter: 'rating', min: 0, max: 100 },
	{ filter: 'tags', min: 0, max: 5 }
];

const prepareUsers = async () => {
	await clearUsers();
	requestor = await loginAndPrepareUser(user7, credentials7, profileData7); //female bi - matcha7 - 2km

	await loginAndPrepareUser(newUser, credentialsNewUser, profileDataNewUser); //male straight - matcha - def coords
	await loginAndPrepareUser(user4, credentials4, profileData4); //male bi - matcha4 - 6km
	await loginAndPrepareUser(user5, credentials5, profileData5); //female straight - matcha5 - 17km
	await loginAndPrepareUser(user6, credentials6, profileData6); //female gay - matcha6 - 94km
	await loginAndPrepareUser(user9, credentials9, profileData9); //female gay
	await loginAndPrepareUser(user10, credentials10, profileData10); //female bi
};

const getSearchPage = async (user: TokenAndId, sortAndFilter: { sort: SortingCriteria; filter: FilterCriteria[] }) => {
	const res = await api
		.post(`/api/users/match_suggestions`)
		.set({ Authorization: `bearer ${user.token}` })
		.send(sortAndFilter)
		.expect('Content-Type', /application\/json/);

	expect(res.statusCode).toBe(200);
	expect(res.body).toBeTruthy();
	return res.body;
};

//https://stackoverflow.com/questions/53833139/check-array-in-js-is-list-sorted
const isSortedAsc = (arr: number[]) => arr.every((v: number, i: number, a: number[]) => !i || a[i - 1] <= v);
const isSortedDesc = (arr: number[]) => arr.every((v: number, i: number, a: number[]) => !i || a[i - 1] >= v);

describe('testing search results with all sort criterias', () => {
	beforeAll(async () => {
		await prepareUsers();
	});

	test('sorted properly by distance asc order', async () => {
		const searchResult = await getSearchPage(requestor, { sort: sortByDistance, filter: filter });
		expect(searchResult.length).toBe(5);

		const distances = searchResult.map((profile: { distance: number }) => profile.distance);
		//console.log('sort by distance asc: ', distances);
		expect(isSortedAsc(distances)).toBeTruthy();
	});

	test('sorted properly by distance desc order', async () => {
		const searchResult = await getSearchPage(requestor, { sort: sortByDistanceReversed, filter: filter });
		expect(searchResult.length).toBe(5);

		const distances = searchResult.map((profile: { distance: number }) => profile.distance);
		//console.log('sort by distance desc: ', distances);
		expect(isSortedDesc(distances)).toBeTruthy();
	});

	test('sorted properly by age asc order', async () => {
		const searchResult = await getSearchPage(requestor, { sort: sortByAge, filter: filter });
		expect(searchResult.length).toBe(5);

		const ages = searchResult.map((profile: { age: number }) => profile.age);
		// console.log('sort by age asc: ', ages);
		expect(isSortedAsc(ages)).toBeTruthy();
	});

	test('sorted properly by age desc order', async () => {
		const searchResult = await getSearchPage(requestor, { sort: sortByAgeReversed, filter: filter });
		expect(searchResult.length).toBe(5);

		const ages = searchResult.map((profile: { age: number }) => profile.age);
		// console.log('sort by age desc: ', ages);
		expect(isSortedDesc(ages)).toBeTruthy();
	});

	test('sorted properly by tags asc order', async () => {
		const searchResult = await getSearchPage(requestor, { sort: sortByTagsReversed, filter: filter });
		expect(searchResult.length).toBe(5);

		const tags = searchResult.map((profile: { tags: string[] }) => profile.tags);

		const amountOfCommonTags = tags.map((tagArr: string | string[]) => {
			const res = profileData7.tags.filter((v) => tagArr.includes(v));
			return res.length;
		});
		// console.log('sort by tags asc: ', amountOfCommonTags);
		expect(isSortedAsc(amountOfCommonTags)).toBeTruthy();
	});

	test('sorted properly by tags desc order', async () => {
		const searchResult = await getSearchPage(requestor, { sort: sortByTags, filter: filter });
		expect(searchResult.length).toBe(5);

		const tags = searchResult.map((profile: { tags: string[] }) => profile.tags);
		const amountOfCommonTags = tags.map((tagArr: string | string[]) => {
			const res = profileData7.tags.filter((v) => tagArr.includes(v));
			return res.length;
		});

		// console.log('sort by tags desc: ', amountOfCommonTags);
		expect(isSortedDesc(amountOfCommonTags)).toBeTruthy();
	});

	test('sorted properly by rating desc order', async () => {
		const searchResult = await getSearchPage(requestor, { sort: sortByRating, filter: filter });
		expect(searchResult.length).toBe(5);

		const ratings = searchResult.map((profile: { fameRating: number }) => profile.fameRating);
		// console.log('sort by rating asc: ', ratings);
		expect(isSortedDesc(ratings)).toBeTruthy();
	});

	test('sorted properly by rating asc order', async () => {
		const searchResult = await getSearchPage(requestor, { sort: sortByRatingReversed, filter: filter });
		expect(searchResult.length).toBe(5);

		const ratings = searchResult.map((profile: { fameRating: number }) => profile.fameRating);
		// console.log('sort by rating desc: ', ratings);
		expect(isSortedAsc(ratings)).toBeTruthy();
	});
});
