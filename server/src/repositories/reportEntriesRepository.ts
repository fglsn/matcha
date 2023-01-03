import pool from '../db';
import { getString } from '../dbUtils';
import { ReportEntry } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const reportEntryMapper = (row: any): ReportEntry => {
	return {
		reportedUserId: getString(row['reported_user_id']),
		reportingUserId: getString(row['reporting_user_id'])
	};
};

const getReportEntriesByUserId = async (reportedUserId: string): Promise<ReportEntry[] | undefined> => {
	const query = {
		text: 'select * from report_entries where reported_user_id = $1',
		values: [reportedUserId]
	};
	const res = await pool.query(query);
	if (!res.rowCount) {
		return undefined;
	}
	return res.rows.map((row) => reportEntryMapper(row));
};

const getReportEntriesByReportingUserId = async (reportingUserId: string): Promise<ReportEntry[] | undefined> => {
	const query = {
		text: 'select * from report_entries where reporting_user_id = $1',
		values: [reportingUserId]
	};
	const res = await pool.query(query);
	if (!res.rowCount) {
		return undefined;
	}
	return res.rows.map((row) => reportEntryMapper(row));
};

const checkReportEntry = async (reportedUserId: string, reportingUserId: string): Promise<boolean> => {
	const query = {
		text: 'select * from report_entries where reported_user_id = $1 and reporting_user_id = $2',
		values: [reportedUserId, reportingUserId]
	};
	const res = await pool.query(query);
	if (!res.rowCount) {
		return false;
	}
	return true;
};

const addReportEntry = async (reportedUserId: string, reportingUserId: string): Promise<boolean> => {
	const query = {
		text: 'insert into report_entries(reported_user_id, reporting_user_id) values($1, $2) on conflict do nothing',
		values: [reportedUserId, reportingUserId]
	};
	const res = await pool.query(query);
	if (!res.rowCount) {
		return false;
	}
	return true;
};

const getReportsCountByUserId = async (reportedUserId: string): Promise<number> => {
	const query = {
		text: 'select count(*) as report_count from report_entries where reported_user_id = $1',
		values: [reportedUserId]
	};
	const res = await pool.query(query);
	return Number(res.rows[0]['report_count']);
};

const clearReportEntries = async (): Promise<void> => {
	await pool.query('truncate table report_entries');
};

export { getReportEntriesByUserId, getReportEntriesByReportingUserId, checkReportEntry, addReportEntry, getReportsCountByUserId, clearReportEntries };
