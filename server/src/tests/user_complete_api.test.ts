import supertest from 'supertest';
import { describe, expect } from '@jest/globals';
import { app } from '../app';
import { newUser, loginUser, infoProfile, defaultCoordinates, ipAddress, completenessFalse, completenessTrue } from './test_helper';
import { clearUsers, findUserByUsername } from '../repositories/userRepository';
// import { clearSessions } from '../repositories/sessionRepository';
import { requestCoordinatesByIp, getLocation } from '../services/location';
import { createNewUser } from '../services/users';
import { DataURL } from './test_helper_images';

const api = supertest(app);

jest.setTimeout(10000);

jest.mock('../services/location');
const requestCoordinatesByIpMock = jest.mocked(requestCoordinatesByIp);
const getLocationMock = jest.mocked(getLocation);

let loginRes = <supertest.Response>{};
let id = <string>'';

const initLoggedUser = async () => {
	const user = await findUserByUsername(newUser.username);
	const activationCode = user?.activationCode;
	await api.post(`/api/users/activate/${activationCode}`);
	const res = await api.post('/api/login').send(loginUser);
	return res;
};

const putToProfile = async () => {
	getLocationMock.mockReturnValue(Promise.resolve('Helsinki, Finland'));
	await api
		.put(`/api/users/${id}/profile`)
		.set({ Authorization: `bearer ${loginRes.body.token}` })
		.send(infoProfile);
	// if (res.body.error)
	// 	console.log(res.body.error);
};
const postToPhotos = async () => {
	await api
		.post(`/api/users/${id}/photos`)
		.set({ Authorization: `bearer ${loginRes.body.token}` })
		.send({ images: [{ dataURL: DataURL }] });
};
describe('Check repsonse of GET to /api/users/:id/complete', () => {
	beforeEach(async () => {
		await clearUsers();
		requestCoordinatesByIpMock.mockReturnValue(Promise.resolve(defaultCoordinates));
		await createNewUser(newUser, ipAddress);
		loginRes = await initLoggedUser();
		id = <string>JSON.parse(loginRes.text).id;
		// resFromProfile = await getResFromProfile(loginRes);
	});
	test('should respond 200 and competness: false', async () => {
		const resFromComplete = await api.get(`/api/users/${id}/complete`).set({ Authorization: `bearer ${loginRes.body.token}` });

		expect(resFromComplete.statusCode).toBe(200);
		expect(JSON.parse(resFromComplete.text)).toEqual(completenessFalse);
	});
	test('should respond 200 and competness: false', async () => {
		await putToProfile();
		const resFromComplete = await api.get(`/api/users/${id}/complete`).set({ Authorization: `bearer ${loginRes.body.token}` });

		expect(resFromComplete.statusCode).toBe(200);
		expect(JSON.parse(resFromComplete.text)).toEqual(completenessFalse);
	});
	test('should respond 200 and competness: false', async () => {
		await postToPhotos();
		const resFromComplete = await api.get(`/api/users/${id}/complete`).set({ Authorization: `bearer ${loginRes.body.token}` });

		expect(resFromComplete.statusCode).toBe(200);
		expect(JSON.parse(resFromComplete.text)).toEqual(completenessFalse);
	});
	test('should respond 200 and competness: true', async () => {
		await putToProfile();
		await postToPhotos();
		const resFromComplete = await api.get(`/api/users/${id}/complete`).set({ Authorization: `bearer ${loginRes.body.token}` });
		expect(resFromComplete.statusCode).toBe(200);
		expect(JSON.parse(resFromComplete.text)).toEqual(completenessTrue);
	});
});
