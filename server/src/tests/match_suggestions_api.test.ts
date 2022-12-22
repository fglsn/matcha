/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe } from '@jest/globals';
import { clearUsers } from '../repositories/userRepository';
//prettier-ignore
import { api, loginAndPrepareCustomUser} from './test_helper_fns';
//prettier-ignore
import { user3, user4, user5, user6, user7, user1, user2, profileData4, profileData1, profileData2, profileData3, profileData5, profileData6, profileData7, loginUser1, loginUser2, loginUser3, loginUser4, loginUser5, loginUser6, loginUser7 } from './test_helper_users';

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
	userOne = await loginAndPrepareCustomUser(user1, loginUser1, profileData1);
	userTwo = await loginAndPrepareCustomUser(user2, loginUser2, profileData2);
	userThree = await loginAndPrepareCustomUser(user3, loginUser3, profileData3);
	userFour = await loginAndPrepareCustomUser(user4, loginUser4, profileData4);
	userFive = await loginAndPrepareCustomUser(user5, loginUser5, profileData5);
	userSix = await loginAndPrepareCustomUser(user6, loginUser6, profileData6);
	userSeven = await loginAndPrepareCustomUser(user7, loginUser7, profileData7);
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
