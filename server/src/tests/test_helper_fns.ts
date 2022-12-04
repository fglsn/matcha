/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import supertest from 'supertest';
import { app } from '../app';
import { infoProfile, defaultCoordinates, ipAddress } from './test_helper';
import { DataURL } from './test_helper_images';
import { findUserByUsername } from '../repositories/userRepository';
import { requestCoordinatesByIp, getLocation } from '../services/location';
import { createNewUser } from '../services/users';
import { NewUser } from '../types';
// import { clearSessions } from '../repositories/sessionRepository';

export const api = supertest(app);

export let id = <string>'';
export let loginRes = <supertest.Response>{};

jest.mock('../services/location');
export const requestCoordinatesByIpMock = jest.mocked(requestCoordinatesByIp);
export const getLocationMock = jest.mocked(getLocation);

export const initLoggedUser = async (username: string, loginUser: { username: string; password: string }) => {
	const user = await findUserByUsername(username);
	const activationCode = user?.activationCode;
	await api.post(`/api/users/activate/${activationCode}`);
	const res = await api.post('/api/login').send(loginUser).expect(200);
	return res;
};

export const putToProfile = async (id: string) => {
	getLocationMock.mockReturnValue(Promise.resolve('Helsinki, Finland'));
	await api
		.put(`/api/users/${id}/profile`)
		.set({ Authorization: `bearer ${loginRes.body.token}` })
		.send(infoProfile)
		.expect(200);
	// if (res.body.error)
	// 	console.log(res.body.error);
};

export const postToPhotos = async (id: string) => {
	await api
		.post(`/api/users/${id}/photos`)
		.set({ Authorization: `bearer ${loginRes.body.token}` })
		.send({ images: [{ dataURL: DataURL }] })
		.expect(200);
};

export const loginAndPrepareUser = async (user: NewUser, loginUser: { username: string; password: string }) => {
	requestCoordinatesByIpMock.mockReturnValue(Promise.resolve(defaultCoordinates));
	await createNewUser(user, ipAddress);
	loginRes = await initLoggedUser(user.username, loginUser);
	id = <string>JSON.parse(loginRes.text).id;
	await Promise.all([putToProfile(id), postToPhotos(id)]);
	return { id: id, token: loginRes.body.token };
};

export const putLike = async (visited: { id: string; token: string }, visitor: { id: string; token: string }) => {
	const resFromProfilePage = await api
		.post(`/api/users/${visited.id}/public_profile/like`)
		.set({ Authorization: `bearer ${visitor.token}` })
		.expect(200);

	expect(resFromProfilePage.statusCode).toBe(200);
	expect(resFromProfilePage.body).toBeTruthy();
};

export const removeLike = async (visited: { id: string; token: string }, visitor: { id: string; token: string }) => {
	const resFromProfilePage = await api
		.delete(`/api/users/${visited.id}/public_profile/like`)
		.set({ Authorization: `bearer ${visitor.token}` })
		.expect(200);

	expect(resFromProfilePage.statusCode).toBe(200);
	expect(resFromProfilePage.body).toBeTruthy();
};

