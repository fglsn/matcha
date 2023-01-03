/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { describe } from '@jest/globals';
import { clearUsers } from '../repositories/userRepository';
import { Criterias, Order } from '../types';
import { api, loginAndPrepareUser } from './test_helper_fns';
import {
	newUser,
	user4,
	user6,
	user7,
	profileDataNewUser,
	profileData4,
	profileData6,
	profileData7,
	credentialsNewUser,
	credentials4,
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

const prepareUsers = async () => {
	await clearUsers();
	requestor = await loginAndPrepareUser(user7, credentials7, profileData7); //['Reading', 'Singing', 'Poetry', 'Sauna', 'Pets'],
	await loginAndPrepareUser(newUser, credentialsNewUser, profileDataNewUser); //dist 2km, age 23, rating 47, 1 common tag
	await loginAndPrepareUser(user4, credentials4, profileData4); //dist 4km, age 21, rating 46, 2 common tags
	await loginAndPrepareUser(user6, credentials6, profileData6); //dist 28km, age 68, rating 44, 0 common tags
	await loginAndPrepareUser(user9, credentials9, profileData9); //dist 42km, age 34, rating 47, 3 common tags
	await loginAndPrepareUser(user10, credentials10, profileData10); //dist 42km, age 44, rating 47, 5 common tags
};

const defaultSort: { sort: Criterias; order: Order } = { sort: 'distance', order: 'asc' };
const isSortedAsc = (arr: number[]) => arr.every((v: number, i: number, a: number[]) => !i || a[i - 1] <= v);

describe('testing search results with different filter criterias', () => {
	beforeAll(async () => {
		await prepareUsers();
	});

	describe('testing search results with different valid filter criterias', () => {
		//Distance
		it.each([
			[[{ filter: 'distance', min: 2, max: 50 }], 5],
			[[{ filter: 'distance', min: 2, max: 2 }], 1],
			[[{ filter: 'distance', min: 2, max: 30 }], 3],
			[[{ filter: 'distance', min: 0, max: 30 }], 3],
			[[{ filter: 'distance', min: -42, max: 30 }], 3],
			[[{ filter: 'distance', min: 4, max: 100 }], 4],
			[[{ filter: 'distance', min: 4, max: 100 }], 4],
			[[{ filter: 'distance', min: 4, max: -33 }], 0],
			[[{ filter: 'distance', min: 28, max: 28 }], 1],
			[[{ filter: 'distance', min: 2, undefined }], 5],
			[[{ filter: 'distance', min: 29, max: undefined }], 2],
			[[{ filter: 'distance', min: 131, max: 13 }], 0]
		])(`Filtered properly by distance ranges %s %s`, async (distanceFilter, numberOfProfilesFound) => {
			const searchResult = await api
				.post(`/api/users/match_suggestions`)
				.set({ Authorization: `bearer ${requestor.token}` })
				.send({ sort: defaultSort, filter: distanceFilter })
				.expect(200)
				.expect('Content-Type', /application\/json/);

			// console.log(searchResult.body);
			expect(searchResult.body.length).toBe(numberOfProfilesFound);
			const distances = searchResult.body.map((profile: { distance: number }) => profile.distance);
			expect(isSortedAsc(distances)).toBeTruthy();
		});

		//Age
		it.each([
			[[{ filter: 'age', min: 18, max: 80 }], 5],
			[[{ filter: 'age', min: 18, max: 50 }], 4],
			[[{ filter: 'age', min: 21, max: 21 }], 1],
			[[{ filter: 'age', min: 0, max: 30 }], 2],
			[[{ filter: 'age', min: -42, max: 30 }], 2],
			[[{ filter: 'age', min: 4, max: 100 }], 5],
			[[{ filter: 'age', min: 68, max: 68 }], 1],
			[[{ filter: 'age', min: 4, max: -33 }], 0],
			[[{ filter: 'age', min: 24, undefined }], 3],
			[[{ filter: 'age', min: -66, max: undefined }], 5],
			[[{ filter: 'age', min: 42, max: 24 }], 0]
		])(`Filtered properly by valid age range %s %s`, async (ageFilter, numberOfProfilesFound) => {
			const searchResult = await api
				.post(`/api/users/match_suggestions`)
				.set({ Authorization: `bearer ${requestor.token}` })
				.send({ sort: defaultSort, filter: ageFilter })
				.expect(200)
				.expect('Content-Type', /application\/json/);

			// console.log(searchResult.body);
			expect(searchResult.body.length).toBe(numberOfProfilesFound);
			const distances = searchResult.body.map((profile: { distance: number }) => profile.distance);
			expect(isSortedAsc(distances)).toBeTruthy();
		});

		//Amount of common tags
		it.each([
			[[{ filter: 'tags', min: 0, max: 5 }], 5],
			[[{ filter: 'tags', min: 0, max: 1 }], 2],
			[[{ filter: 'tags', min: 1, max: 1 }], 1],
			[[{ filter: 'tags', min: 2, max: 2 }], 1],
			[[{ filter: 'tags', min: 2, max: 5 }], 3],
			[[{ filter: 'tags', min: -42, max: 3 }], 4],
			[[{ filter: 'tags', min: 4, max: 4 }], 0],
			[[{ filter: 'tags', min: 5, max: 9 }], 1],
			[[{ filter: 'tags', min: -2, max: 1 }], 2],
			[[{ filter: 'tags', min: 0, undefined }], 5],
			[[{ filter: 'tags', min: -22, undefined }], 5],
			[[{ filter: 'tags', min: 3, max: undefined }], 2],
			[[{ filter: 'tags', min: 5, max: 0 }], 0]
		])(`Filtered properly by valid common tags range %s %s`, async (tagsFilter, numberOfProfilesFound) => {
			const searchResult = await api
				.post(`/api/users/match_suggestions`)
				.set({ Authorization: `bearer ${requestor.token}` })
				.send({ sort: defaultSort, filter: tagsFilter })
				.expect(200)
				.expect('Content-Type', /application\/json/);

			// console.log(searchResult.body);
			expect(searchResult.body.length).toBe(numberOfProfilesFound);
			const distances = searchResult.body.map((profile: { distance: number }) => profile.distance);
			expect(isSortedAsc(distances)).toBeTruthy();
		});

		//Rating
		it.each([
			[[{ filter: 'rating', min: 0, max: 100 }], 5],
			[[{ filter: 'rating', min: -100, max: 150 }], 5],
			[[{ filter: 'rating', min: 40, max: 45 }], 1],
			[[{ filter: 'rating', min: 47, max: 100 }], 3],
			[[{ filter: 'rating', min: 44, max: 44 }], 1],
			[[{ filter: 'rating', min: -42, max: 46 }], 2],
			[[{ filter: 'rating', min: -42, max: undefined }], 5],
			[[{ filter: 'rating', min: -42 }], 5],
			[[{ filter: 'rating', min: 0, withMaxUndefined: 123 }], 5],
			[[{ filter: 'rating', min: 42, max: 22 }], 0]
		])(`Filtered properly by valid common rating range %s %s`, async (ratingFilter, numberOfProfilesFound) => {
			const searchResult = await api
				.post(`/api/users/match_suggestions`)
				.set({ Authorization: `bearer ${requestor.token}` })
				.send({ sort: defaultSort, filter: ratingFilter })
				.expect(200)
				.expect('Content-Type', /application\/json/);

			//console.log(searchResult.body);
			expect(searchResult.body.length).toBe(numberOfProfilesFound);
			const distances = searchResult.body.map((profile: { distance: number }) => profile.distance);
			expect(isSortedAsc(distances)).toBeTruthy();
		});

		//Multiple filters
		it.each([
			[
				[
					{ filter: 'distance', min: 2, max: 44 },
					{ filter: 'rating', min: 44, max: 46 }
				],
				2
			],
			[
				[
					{ filter: 'distance', min: 2, max: 66 },
					{ filter: 'age', min: 18, max: 35 }
				],
				3
			],
			[
				[
					{ filter: 'distance', min: 2, max: 66 },
					{ filter: 'age', min: 18, max: 35 },
					{ filter: 'tags', min: 3, max: 3 }
				],
				1
			],
			[
				[
					{ filter: 'distance', min: 2, max: 66 },
					{ filter: 'age', min: 18, max: 35 },
					{ filter: 'tags', min: 3, max: 3 },
					{ filter: 'rating', min: 48 }
				],
				0
			]
		])(`Filtered properly with multiple filters %s %s`, async (ratingFilter, numberOfProfilesFound) => {
			const searchResult = await api
				.post(`/api/users/match_suggestions`)
				.set({ Authorization: `bearer ${requestor.token}` })
				.send({ sort: defaultSort, filter: ratingFilter })
				.expect(200)
				.expect('Content-Type', /application\/json/);

			//console.log(searchResult.body);
			expect(searchResult.body.length).toBe(numberOfProfilesFound);
			const distances = searchResult.body.map((profile: { distance: number }) => profile.distance);
			expect(isSortedAsc(distances)).toBeTruthy();
		});
	});

	describe('testing search results with incorrectly formatted filter criterias', () => {
		it.each([
			[[{ filter: 'incorrect', min: 0, max: 100 }], 'Invalid format of criteria'],
			[[{ filter: 123, min: 0, max: 100 }], 'Invalid format of criteria'],
			[[{ filter: null, min: 0, max: 100 }], 'Invalid format of criteria'],
			[[{ filter: 'rating', undefined, max: 100 }], 'Invalid format of filter criteria'],
			[[{ filter: 'rating', min: 0, max: null }], 'Invalid max value in filter criteria validation.'],
			[[{ filter: 'age', min: null, max: 100 }], 'Invalid min value in filter criteria validation.'],
			[[{ filter: 'tags', incorrect: 0, max: 100 }], 'Invalid format of filter criteria'],
			[[{ filter: 'distance', min: '1', max: 100 }], 'Invalid min value in filter criteria validation.'],
			[[{ filter: 'rating', min: 0, max: '100' }], 'Invalid max value in filter criteria validation.'],
			[[{ incorrect: 'rating', min: 0, max: 100 }], 'Invalid format of filter criteria'],
			[[{ undefined, min: 0, max: 100 }], 'Invalid format of filter criteria']
		])(`Error on incorrect format of filter or min/max values %s %s`, async (incorrectFilter, expectedErrorMessage) => {
			const searchResult = await api
				.post(`/api/users/match_suggestions`)
				.set({ Authorization: `bearer ${requestor.token}` })
				.send({ sort: defaultSort, filter: incorrectFilter })
				.expect(400)
				.expect('Content-Type', /application\/json/);

			//console.log(searchResult.body.error);
			expect(searchResult.body.error).toContain(expectedErrorMessage);
		});
	});
});
