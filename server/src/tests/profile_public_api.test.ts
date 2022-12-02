import supertest from 'supertest';
import { describe, expect } from '@jest/globals';
import { app } from '../app';
import { newUser, loginUser, infoProfile, defaultCoordinates, ipAddress, infoProfilePublic } from './test_helper';
import { clearUsers, findUserByUsername } from '../repositories/userRepository';
import { clearSessions } from '../repositories/sessionRepository';
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
	const res = await api.post('/api/login').send(loginUser).expect(200);
	return res;
};

const putToProfile = async () => {
	getLocationMock.mockReturnValue(Promise.resolve('Helsinki, Finland'));
	await api
		.put(`/api/users/${id}/profile`)
		.set({ Authorization: `bearer ${loginRes.body.token}` })
		.send(infoProfile)
		.expect(200);
	// if (res.body.error)
	// 	console.log(res.body.error);
};

const postToPhotos = async () => {
	await api
		.post(`/api/users/${id}/photos`)
		.set({ Authorization: `bearer ${loginRes.body.token}` })
		.send({ images: [{ dataURL: DataURL }] })
		.expect(200);
};

describe('check access to profile page', () => {
	beforeAll(async () => {
		await clearUsers();
		requestCoordinatesByIpMock.mockReturnValue(Promise.resolve(defaultCoordinates));
		await createNewUser(newUser, ipAddress);
		loginRes = await initLoggedUser();
		id = <string>JSON.parse(loginRes.text).id;
		await Promise.all([putToProfile(), postToPhotos()]);
	});
	test('logged user can visit public profile page', async () => {
		const resFromProfilePage = await api
			.get(`/api/users/${id}/public_profile`)
			.set({ Authorization: `bearer ${loginRes.body.token}` })
			.expect('Content-Type', /application\/json/);

		expect(resFromProfilePage.statusCode).toBe(200);
		expect(resFromProfilePage.body).toBeTruthy();
		console.log(resFromProfilePage.text);

		expect(resFromProfilePage.text).toContain('lorem');
		expect(JSON.parse(resFromProfilePage.text)).toEqual({ ...infoProfilePublic, id: id });
	});
	test('not logged user cannot access profile page', async () => {
		const resFromProfilePage = await api
			.get(`/api/users/${id}/public_profile`)
			.expect(401)
			.expect('Content-Type', /application\/json/);

		expect(resFromProfilePage.body.error).toContain('Access denied, no token provided');
	});
	test('should fail when no id in request', async () => {
		const resFromProfilePage = await api
			.get(`/api/users//public_profile`)
			.set({ Authorization: `bearer ${loginRes.body.token}` })
			.expect(404);
		expect(resFromProfilePage.body.error).toContain('Unknown endpoint');
	});
	test('should fail request with wrong id in request', async () => {
		const resFromProfilePage = await api
			.get(`/api/users/11111111/public_profile`)
			.set({ Authorization: `bearer ${loginRes.body.token}` })
			.expect(400);
		expect(resFromProfilePage.body.error).toContain('No user with provided id');
	});
	test('fails when no session in db', async () => {
		await clearSessions();
		const resFromProfilePage = await api
			.get(`/api/users/${id}/public_profile`)
			.set({ Authorization: `bearer ${loginRes.body.token}` })
			.expect(401)
			.expect('Content-Type', /application\/json/);

		expect(resFromProfilePage.body.error).toContain('No sessions found');
	});
});
