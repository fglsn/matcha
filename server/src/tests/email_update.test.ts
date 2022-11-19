import { describe, expect } from '@jest/globals';
import supertest from 'supertest';
import { app } from '../app';
import { clearEmailResetRequestsTable, findEmailResetRequestByUserId } from '../repositories/emailResetRequestRepository';
// import { findPasswordResetRequestByUserId, clearPasswordResetRequestsTable } from '../repositories/passwordResetRequestRepository';
// import { findSessionsByUserId } from '../repositories/sessionRepository';
import { clearUsers, findUserByUsername } from '../repositories/userRepository';

import { createNewUser, sendEmailResetLink } from '../services/users';
import { loginUser, newEmail, newUser } from './test_helper';

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

let loginRes = <supertest.Response>{};

const initLoggedUser = async () => {
	const user = await findUserByUsername(newUser.username);
	const activationCode = user?.activationCode;
	await api.get(`/api/users/activate/${activationCode}`);
	const res = await api.post('/api/login').send(loginUser).expect(200);
	return res;
};

// const requestEmailReset = async () => {
// 	await api
//             .post('/api/users/email/update')
//             .set({ Authorization: `bearer ${loginRes.body.token}` })
//             .send(newEmail)
//             .expect(201);
// };

beforeEach(() => {
	sendMailMock.mockClear();
});

describe('send email reset link on email/update request', () => {
	beforeAll(async () => {
		await clearUsers();
		await clearEmailResetRequestsTable();
		await createNewUser(newUser);
		loginRes = await initLoggedUser();
	});

	test('logged user can update request email update', async () => {
		await api
			.post('/api/users/email/update')
			.set({ Authorization: `bearer ${loginRes.body.token}` })
			.send({ email: 'tester1.hive@yahoo.com' })
			.expect(201);

		expect(sendMailMock).toBeCalledTimes(1);
		expect(sendMailMock.mock.calls[0][0]['to']).toBe('tester1.hive@yahoo.com');
	});

	test('not logged user not allowed to update email', async () => {
		const resFromEmailUpdate = await api
			.post('/api/users/email/update')
			.send({ email: 'tester1.hive@yahoo.com' })
			.expect(401)
			.expect('Content-Type', /application\/json/);

		expect(resFromEmailUpdate.body.error).toContain('Access denied, no token provided');
		expect(sendMailMock).toBeCalledTimes(0);
	});
});

describe('update email after request has been sent', () => {
	let id = <string>'';
	beforeAll(async () => {
		await clearUsers();
		await clearEmailResetRequestsTable();
		await createNewUser(newUser);
		loginRes = await initLoggedUser();
		id = <string>JSON.parse(loginRes.text).id;
		await sendEmailResetLink(id, newEmail.email);
	});
	test('update email with token from request', async () => {
		const resetRequest = await findEmailResetRequestByUserId(id);
		expect(resetRequest).toBeDefined();
		await api
			.get(`/api/users/email/update/${resetRequest?.token}`)
			.set({ Authorization: `bearer ${loginRes.body.token}` })
			.expect(200);

		//expect(resFromEmailUpdate.body.error).toContain('Access denied, no token provided');
		expect(sendMailMock).toBeCalledTimes(0);
	});
});
