import supertest from 'supertest';
import { describe, expect } from '@jest/globals';
import { app } from '../app';
import { defaultCoordinates, ipAddress, loginUser, newEmail, newUser, secondUser } from './test_helper';
import { clearUpdateEmailRequestsTable, findUpdateEmailRequestByUserId } from '../repositories/updateEmailRequestRepository';
import { clearUsers, findUserByEmail, findUserByUsername } from '../repositories/userRepository';
import { createNewUser, sendUpdateEmailLink } from '../services/users';
import { requestCoordinatesByIp } from '../services/location';

const api = supertest(app);

jest.setTimeout(100000);
const sendMailMock = jest.fn(); // this will return undefined if .sendMail() is called

jest.mock('nodemailer', () => ({
	createTransport: jest.fn().mockImplementation(() => {
		return {
			sendMail: sendMailMock
		};
	})
}));

jest.mock('../services/location');
const requestCoordinatesByIpMock = jest.mocked(requestCoordinatesByIp);

let loginRes = <supertest.Response>{};

const initLoggedUser = async () => {
	const user = await findUserByUsername(newUser.username);
	const activationCode = user?.activationCode;
	await api.post(`/api/users/activate/${activationCode}`);
	const res = await api.post('/api/login').send(loginUser).expect(200);
	return res;
};

beforeEach(() => {
	sendMailMock.mockClear();
});

describe('send email reset link on email/update request', () => {
	beforeAll(async () => {
		await clearUsers();
		await clearUpdateEmailRequestsTable();
		requestCoordinatesByIpMock.mockReturnValue(Promise.resolve(defaultCoordinates));
		await createNewUser(newUser, ipAddress);
		loginRes = await initLoggedUser();
	});

	test('logged user can request email update', async () => {
		await api
			.post(`/api/users/${loginRes.body.id}/update_email`)
			.set({ Authorization: `bearer ${loginRes.body.token}` })
			.send({ email: 'tester1.hive@yahoo.com' })
			.expect(201);

		expect(sendMailMock).toBeCalledTimes(1);
		expect(sendMailMock.mock.calls[0][0]['to']).toBe('tester1.hive@yahoo.com');
	});

	test('logged user can request email update multiple times in a row', async () => {
		await api
			.post(`/api/users/${loginRes.body.id}/update_email`)
			.set({ Authorization: `bearer ${loginRes.body.token}` })
			.send({ email: 'tester1.hive@yahoo.com' })
			.expect(201);

		expect(sendMailMock).toBeCalledTimes(1);
		expect(sendMailMock.mock.calls[0][0]['to']).toBe('tester1.hive@yahoo.com');
	});

	test('fails to update email when user not logged in', async () => {
		const resFromEmailUpdate = await api
			.post(`/api/users/${loginRes.body.id}/update_email`)
			.send({ email: 'tester1.hive@yahoo.com' })
			.expect(401)
			.expect('Content-Type', /application\/json/);

		expect(resFromEmailUpdate.body.error).toContain('Access denied, no token provided');
		expect(sendMailMock).toBeCalledTimes(0);
	});

	test('fails if user provides same email that he is currently using', async () => {
		const resFromEmailUpdate = await api
			.post(`/api/users/${loginRes.body.id}/update_email`)
			.set({ Authorization: `bearer ${loginRes.body.token}` })
			.send({ email: newUser.email })
			.expect(400);

		expect(resFromEmailUpdate.body.error).toContain('Please provide new email address');
		expect(sendMailMock).toBeCalledTimes(0);
	});

	test('fails when update request is sent for the email that was already used by someone else', async () => {
		requestCoordinatesByIpMock.mockReturnValue(Promise.resolve(defaultCoordinates));
		await createNewUser(secondUser, ipAddress);
		const resFromEmailUpdate = await api
			.post(`/api/users/${loginRes.body.id}/update_email`)
			.set({ Authorization: `bearer ${loginRes.body.token}` })
			.send({ email: secondUser.email })
			.expect(400);

		console.log(resFromEmailUpdate.body.error);
		expect(resFromEmailUpdate.body.error).toContain('This email is already taken');
		expect(sendMailMock).toBeCalledTimes(0);
	});
});

describe('update email after request has been sent', () => {
	let id = <string>'';
	beforeAll(async () => {
		await clearUsers();
		await clearUpdateEmailRequestsTable();
		requestCoordinatesByIpMock.mockReturnValue(Promise.resolve(defaultCoordinates));
		await createNewUser(newUser, ipAddress);
		loginRes = await initLoggedUser();
		id = <string>JSON.parse(loginRes.text).id;
		await sendUpdateEmailLink(id, newEmail.email);
	});
	test('succesfully update email with valid token from request by visiting link', async () => {
		const resetRequest = await findUpdateEmailRequestByUserId(id);
		expect(resetRequest).toBeDefined();
		await api
			.put(`/api/users/update_email/${resetRequest?.token}`)
			.set({ Authorization: `bearer ${loginRes.body.token}` })
			.expect(200);
		const updatedUser = await findUserByUsername(newUser.username);
		expect(updatedUser?.email).toBe(newEmail.email);
		expect(await findUserByEmail(newUser.email)).toBeFalsy();
	});

	it.each([
		[undefined, 'Invalid email reset code'],
		[null, 'Invalid email reset code'],
		['', 'Missing activation code'],
		['    ', 'Missing activation code'],
		['		', 'Missing activation code'],
		['12345', 'Invalid email reset code'], //too short
		['1234567890123456789012345678901234567890', 'Invalid email reset code'], //too long 40chars
		['2>-)837428374t-2983<32v74slk-dkfhkhf', 'Invalid email reset code'],
		['!0831j37-7cbb-4ca0-91cb-5fda0cee63!3', 'Invalid email reset code'],
		['42e7ed49-58f4-4ca7-b478-3d3805a7bb7>', 'Invalid email reset code']
	])('fails with incorectly formatted token %s %s', async (invalidToken, expectedErrorMessage) => {
		// console.log(`Payload: ${invalidToken}, Expected msg: ${expectedErrorMessage}`);
		const res = await api.put(`/api/users/update_email/${invalidToken}`).expect(400);
		if (!res.body.error) fail();
		expect(res.body.error).toContain(expectedErrorMessage);
	});

	test('fails with valid but non existing/expired token in db', async () => {
		const res = await api.put(`/api/users/update_email/9bcd25f2-7667-4736-8770-0a132c5a7dca`).expect(400);
		if (!res.body.error) fail();
		expect(res.body.error).toContain('Invalid reset link. Please try again.');
	});
});
