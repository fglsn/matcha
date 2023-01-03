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
	requestor = await loginAndPrepareUser(user7, credentials7, profileData7);
	await loginAndPrepareUser(newUser, credentialsNewUser, profileDataNewUser); //dist 2km, age 23, rating 47
	await loginAndPrepareUser(user4, credentials4, profileData4); //dist 4km, age 21, rating 46
	await loginAndPrepareUser(user6, credentials6, profileData6); //dist 28km, age 68, rating 47
	await loginAndPrepareUser(user9, credentials9, profileData9); //dist 42km, age 34, rating 47
	await loginAndPrepareUser(user10, credentials10, profileData10); //dist 42km, age 44, rating 47
};

const defaultSort: { sort: Criterias; order: Order } = { sort: 'distance', order: 'asc' };
const isSortedAsc = (arr: number[]) => arr.every((v: number, i: number, a: number[]) => !i || a[i - 1] <= v);

describe('testing search results with different filter criterias', () => {
	beforeAll(async () => {
		await prepareUsers();
	});

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
		[[{ filter: 'distance', min: 29, max: undefined }], 2]
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
		[[{ filter: 'age', min: 24, undefined }], 3]
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
});
