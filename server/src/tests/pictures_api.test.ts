import { describe, expect } from '@jest/globals';
import supertest from 'supertest';

import { app } from '../app';
// import { clearSessions } from '../repositories/sessionRepository';
import { clearUsers } from '../repositories/userRepository';
import { requestCoordinatesByIp } from '../services/location';
import { createNewUser } from '../services/users';
import { DataURL, InvDataURL, InvDataURL2, InvDataURL3 } from './test_helper_images';
import { ipAddress, defaultCoordinates } from './test_helper';
import { newUser, credentialsNewUser } from './test_helper_users';
import { initLoggedUser } from './test_helper_fns';

const api = supertest(app);
jest.setTimeout(100000);

jest.mock('../services/location');
const requestCoordinatesByIpMock = jest.mocked(requestCoordinatesByIp);

let loginRes = <supertest.Response>{};

describe('check requests to photos', () => {
	let id = <string>'';
	beforeAll(async () => {
		await clearUsers();
		requestCoordinatesByIpMock.mockReturnValue(Promise.resolve(defaultCoordinates));
		await createNewUser(newUser, ipAddress);
		loginRes = await initLoggedUser(newUser.username, credentialsNewUser);
		id = <string>JSON.parse(loginRes.text).id;
	});
	test('should succeed update photos', async () => {
		await api
			.post(`/api/users/${id}/photos`)
			.set({ Authorization: `bearer ${loginRes.body.token}` })
			.send({ images: [{ dataURL: DataURL }] })
			.expect(200);

		//console.log(resFromProfilePage.error);
		// expect(resFromProfilePage.body).toBeTruthy();
	});
	test('should succeed to get photos', async () => {
		await api
			.post(`/api/users/${id}/photos`)
			.set({ Authorization: `bearer ${loginRes.body.token}` })
			.send({ images: [{ dataURL: DataURL }] })
			.expect(200);

		const resFromProfilePage = await api
			.get(`/api/users/${id}/photos`)
			.set({ Authorization: `bearer ${loginRes.body.token}` })
			.expect(200);

		// console.log(resFromProfilePage.error);

		expect(resFromProfilePage.body).toBeTruthy();
		expect(resFromProfilePage.body.images).toEqual([{ dataURL: DataURL }]);
	});
	test('should fail with invalid photos', async () => {
		const resFromProfilePage = await api
			.post(`/api/users/${id}/photos`)
			.set({ Authorization: `bearer ${loginRes.body.token}` })
			.send({ images: [{ dataURL: InvDataURL }] })
			.expect(400);

		// console.log(resFromProfilePage.error);

		expect(resFromProfilePage.body.error).toContain('Invalid');
	});
	test('should fail with invalid photos', async () => {
		const resFromProfilePage = await api
			.post(`/api/users/${id}/photos`)
			.set({ Authorization: `bearer ${loginRes.body.token}` })
			.send({ images: [{ dataURL: InvDataURL2 }] })
			.expect(400);

		// console.log(resFromProfilePage.error);

		expect(resFromProfilePage.body.error).toContain('Invalid');
	});
	test('should fail with invalid photos', async () => {
		const resFromProfilePage = await api
			.post(`/api/users/${id}/photos`)
			.set({ Authorization: `bearer ${loginRes.body.token}` })
			.send({ images: [{ dataURL: InvDataURL3 }] })
			.expect(400);

		// console.log(resFromProfilePage.error);

		expect(resFromProfilePage.body.error).toContain('Invalid');
	});
});
