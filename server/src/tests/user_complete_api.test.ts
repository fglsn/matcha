import pool from '../db';
import supertest from 'supertest';
import { app } from '../app';
import { describe, expect } from '@jest/globals';
import { defaultCoordinates, ipAddress, completenessFalse, completenessTrue } from './test_helper';
import { newUser, credentialsNewUser, profileDataNewUser } from './test_helper_users';
import { getLocationMock } from './test_helper_fns';
import { DataURL } from './test_helper_images';
import { clearUsers, findUserByUsername } from '../repositories/userRepository';
import { requestCoordinatesByIp } from '../services/location';
import { createNewUser } from '../services/users';

const api = supertest(app);
jest.setTimeout(10000);
jest.mock('../services/location');
const requestCoordinatesByIpMock = jest.mocked(requestCoordinatesByIp);

let loginRes = <supertest.Response>{};
let id = <string>'';

export const initLoggedUser = async () => {
	const user = await findUserByUsername(newUser.username);
	const activationCode = user?.activationCode;
	await api.post(`/api/users/activate/${activationCode}`);
	const res = await api.post('/api/login').send(credentialsNewUser).expect(200);
	return res;
};

export const putToProfile = async () => {
	getLocationMock.mockReturnValue(Promise.resolve('Helsinki, Finland'));
	await api
		.put(`/api/users/${id}/profile`)
		.set({ Authorization: `bearer ${loginRes.body.token}` })
		.send(profileDataNewUser)
		.expect(200);
	// if (res.body.error)
	// 	console.log(res.body.error);
};

export const postToPhotos = async () => {
	await api
		.post(`/api/users/${id}/photos`)
		.set({ Authorization: `bearer ${loginRes.body.token}` })
		.send({ images: [{ dataURL: DataURL }] })
		.expect(200);
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
	test('should respond 200 and competness: false (no basic user data, no photos) ', async () => {
		const resFromComplete = await api.get(`/api/users/${id}/complete`).set({ Authorization: `bearer ${loginRes.body.token}` });

		expect(resFromComplete.statusCode).toBe(200);
		expect(JSON.parse(resFromComplete.text)).toEqual(completenessFalse);
	});
	test('should respond 200 and competness: false (no photos)', async () => {
		await putToProfile();
		const resFromComplete = await api.get(`/api/users/${id}/complete`).set({ Authorization: `bearer ${loginRes.body.token}` });

		expect(resFromComplete.statusCode).toBe(200);
		expect(JSON.parse(resFromComplete.text)).toEqual(completenessFalse);
	});
	test('should respond 200 and competness: false (no basic user data)', async () => {
		await postToPhotos();
		const resFromComplete = await api.get(`/api/users/${id}/complete`).set({ Authorization: `bearer ${loginRes.body.token}` });

		expect(resFromComplete.statusCode).toBe(200);
		expect(JSON.parse(resFromComplete.text)).toEqual(completenessFalse);
	});
	test('should respond 200 and competness: true (all completed)', async () => {
		await putToProfile();
		await postToPhotos();
		const resFromComplete = await api.get(`/api/users/${id}/complete`).set({ Authorization: `bearer ${loginRes.body.token}` });
		expect(resFromComplete.statusCode).toBe(200);
		expect(JSON.parse(resFromComplete.text)).toEqual(completenessTrue);
	});

	describe('returns false if any on the required fields were left empty', () => {
		test('false on null birthday', async () => {
			await postToPhotos();
			const query = {
				text: 'update users set birthday = $2, gender = $3, orientation = $4, bio = $5, tags = $6 where id = $1',
				values: [id, null, 'male', 'gay', 'hehehehehehheheheheeheh', ['Sauna']]
			};
			await pool.query(query);
			const resFromComplete = await api.get(`/api/users/${id}/complete`).set({ Authorization: `bearer ${loginRes.body.token}` });
			expect(resFromComplete.statusCode).toBe(200);
			expect(JSON.parse(resFromComplete.text)).toEqual(completenessFalse);
		});

		test('false on null gender', async () => {
			await postToPhotos();
			const query = {
				text: 'update users set birthday = $2, gender = $3, orientation = $4, bio = $5, tags = $6 where id = $1',
				values: [id, '1988-01-30', null, 'gay', 'hehehehehehheheheheeheh', ['Sauna']]
			};
			await pool.query(query);
			const resFromComplete = await api.get(`/api/users/${id}/complete`).set({ Authorization: `bearer ${loginRes.body.token}` });
			expect(resFromComplete.statusCode).toBe(200);
			expect(JSON.parse(resFromComplete.text)).toEqual(completenessFalse);
		});

		test('false on null orientation', async () => {
			await postToPhotos();
			const query = {
				text: 'update users set birthday = $2, gender = $3, orientation = $4, bio = $5, tags = $6 where id = $1',
				values: [id, '1988-01-30', 'male', null, 'hehehehehehheheheheeheh', ['Sauna']]
			};
			await pool.query(query);
			const resFromComplete = await api.get(`/api/users/${id}/complete`).set({ Authorization: `bearer ${loginRes.body.token}` });
			expect(resFromComplete.statusCode).toBe(200);
			expect(JSON.parse(resFromComplete.text)).toEqual(completenessFalse);
		});

		test('false on null bio', async () => {
			await postToPhotos();
			const query = {
				text: 'update users set birthday = $2, gender = $3, orientation = $4, bio = $5, tags = $6 where id = $1',
				values: [id, '1988-01-30', 'male', 'gay', null, ['Sauna']]
			};
			await pool.query(query);
			const resFromComplete = await api.get(`/api/users/${id}/complete`).set({ Authorization: `bearer ${loginRes.body.token}` });
			expect(resFromComplete.statusCode).toBe(200);
			expect(JSON.parse(resFromComplete.text)).toEqual(completenessFalse);
		});

		test('false on null tags', async () => {
			await postToPhotos();
			const query = {
				text: 'update users set birthday = $2, gender = $3, orientation = $4, bio = $5, tags = $6 where id = $1',
				values: [id, '1988-01-30', 'male', 'gay', 'hehehehehehheheheheeheh', null]
			};
			await pool.query(query);
			const resFromComplete = await api.get(`/api/users/${id}/complete`).set({ Authorization: `bearer ${loginRes.body.token}` });
			expect(resFromComplete.statusCode).toBe(200);
			expect(JSON.parse(resFromComplete.text)).toEqual(completenessFalse);
		});
	});
});
