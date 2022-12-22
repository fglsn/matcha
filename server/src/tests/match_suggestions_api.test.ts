/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe } from '@jest/globals';
import { clearUsers } from '../repositories/userRepository';
import { api, loginAndPrepareUser } from './test_helper_fns';
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
	credentials7
} from './test_helper_users';

jest.setTimeout(10000);
jest.mock('../services/location');

let userOne: { id: string; token: string };
let userTwo: { id: string; token: string };
let userThree: { id: string; token: string };
let userFour: { id: string; token: string };
let userFive: { id: string; token: string };
let userSix: { id: string; token: string };
let userSeven: { id: string; token: string };

const prepareUsers = async () => {
	await clearUsers();
	userOne = await loginAndPrepareUser(newUser, credentialsNewUser, profileDataNewUser);
	userTwo = await loginAndPrepareUser(secondUser, credentialsSecondUser, profileDataSecondUser);
	userThree = await loginAndPrepareUser(user3, credentials3, profileData3);
	userFour = await loginAndPrepareUser(user4, credentials4, profileData4);
	userFive = await loginAndPrepareUser(user5, credentials5, profileData5);
	userSix = await loginAndPrepareUser(user6, credentials6, profileData6);
	userSeven = await loginAndPrepareUser(user7, credentials7, profileData7);
};

describe('test initial filtering (sex preferences, actions)', () => {
	beforeAll(async () => {
		await prepareUsers();
	});

	test('logged user can visit search page', async () => {
		const res = await api
			.get(`/api/users/match_suggestions`)
			.set({ Authorization: `bearer ${userOne.token}` })
			.expect('Content-Type', /application\/json/);

		expect(res.statusCode).toBe(200);
		expect(res.body).toBeTruthy();
		console.log(userTwo, userThree, userFive, userFour, userSix, userSeven);
	});
});
