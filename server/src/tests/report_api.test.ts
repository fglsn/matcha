  /* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { describe, expect } from '@jest/globals';
import { clearUsers, findUserByUsername, increaseReportCount } from '../repositories/userRepository';
import { newUser, loginUser, secondUser, loginUser2 } from './test_helper';
import { api, loginAndPrepareUser, userReportsAnotherUser } from './test_helper_fns';
import { clearLikes } from '../repositories/likesRepository';
import { checkBlockEntry, clearBlockEntries } from '../repositories/blockEntriesRepository';
import { checkReportEntry, getReportsCountByUserId } from '../repositories/reportEntriesRepository';
import { findSessionsByUserId } from '../repositories/sessionRepository';

jest.setTimeout(10000);
jest.mock('../services/location');

let reportingUser: { id: string; token: string };
let userToReport: { id: string; token: string };

describe('test report fake account functionality', () => {
	beforeEach(async () => {
		await Promise.all([clearUsers(), clearLikes(), clearBlockEntries()]);
		reportingUser = await loginAndPrepareUser(newUser, loginUser);
		userToReport = await loginAndPrepareUser(secondUser, loginUser2);
	});

	test('user can succesfully report another user', async () => {
		const reportStatusAtStart = await checkReportEntry(userToReport.id, reportingUser.id);
		expect(reportStatusAtStart).toBeFalsy();

		const reportsCountAtStart = await getReportsCountByUserId(userToReport.id);
		expect(reportsCountAtStart).toBe(0);

		const blockStatusAtStart = await checkBlockEntry(userToReport.id, reportingUser.id);
		expect(blockStatusAtStart).toBeFalsy();

		await userReportsAnotherUser(userToReport, reportingUser);

		const reportsCountAtEnd = await getReportsCountByUserId(userToReport.id);
		expect(reportsCountAtEnd).toBe(1);

		const blockStatusAtEnd = await checkBlockEntry(userToReport.id, reportingUser.id);
		expect(blockStatusAtEnd).toBeTruthy();
	});

	test('report count increases after unique report', async () => {
		const countOnStart = await findUserByUsername(secondUser?.username);
		expect(countOnStart?.reportsCount).toBe(0);

		await userReportsAnotherUser(userToReport, reportingUser);

		const reportsCount = await getReportsCountByUserId(userToReport.id);
		expect(reportsCount).toBe(1);
		const reportsCountAtEnd = await findUserByUsername(secondUser?.username);
		expect(reportsCountAtEnd?.reportsCount).toBe(1);
	});

	test('user can report another user only once', async () => {
		const reportStatusAtStart = await checkReportEntry(userToReport.id, reportingUser.id);
		expect(reportStatusAtStart).toBeFalsy();

		const reportsCountAtStart = await getReportsCountByUserId(userToReport.id);
		expect(reportsCountAtStart).toBe(0);

		await Promise.all([
			userReportsAnotherUser(userToReport, reportingUser),
			userReportsAnotherUser(userToReport, reportingUser),
			userReportsAnotherUser(userToReport, reportingUser)
		]);

		const reportsCountAtEnd = await getReportsCountByUserId(userToReport.id);
		expect(reportsCountAtEnd).toBe(1);
	});

	test('sessions are removed after 11th fake report', async () => {
		const sessionAtStart = await findSessionsByUserId(userToReport.id);
		expect(sessionAtStart).toBeDefined();

		let reportCount;
		for (let i = 0; i < 10; i++) {
			reportCount = await increaseReportCount(userToReport.id);
		}
		expect(reportCount).toBe(10);

		await userReportsAnotherUser(userToReport, reportingUser);

		const newReportsCount = await findUserByUsername(secondUser?.username);
		expect(newReportsCount?.reportsCount).toBe(11);

		const sessions = await findSessionsByUserId(userToReport.id);
		expect(sessions).not.toBeDefined();
	});

	test('user cannot login after 10 fake reports ', async () => {
		const sessionAtStart = await findSessionsByUserId(userToReport.id);
		expect(sessionAtStart).toBeDefined();

		let reportCount;
		for (let i = 0; i < 10; i++) {
			reportCount = await increaseReportCount(userToReport.id);
		}
		expect(reportCount).toBe(10);

		await userReportsAnotherUser(userToReport, reportingUser);

		const newReportsCount = await findUserByUsername(secondUser?.username);
		expect(newReportsCount?.reportsCount).toBe(11);

		const sessions = await findSessionsByUserId(userToReport.id);
		expect(sessions).not.toBeDefined();

		const res = await api.post('/api/login').send(loginUser2).expect(401);

		expect(res.body.error).toContain('Account is blocked');
	});
});
