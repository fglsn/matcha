/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { describe, expect } from '@jest/globals';
import { clearUsers } from '../repositories/userRepository';
import { newUser, loginUser, secondUser, loginUser2 } from './test_helper';
import { loginAndPrepareUser, userReportsAnotherUser } from './test_helper_fns';
import { clearLikes } from '../repositories/likesRepository';
import { checkBlockEntry, clearBlockEntries } from '../repositories/blockEntriesRepository';
import { checkReportEntry, getReportsCountByUserId } from '../repositories/reportEntriesRepository';

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

		const reportsCountAtEnd= await getReportsCountByUserId(userToReport.id);
		expect(reportsCountAtEnd).toBe(1);
	});
});
