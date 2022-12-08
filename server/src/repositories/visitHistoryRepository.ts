import pool from '../db';
import { getString } from '../dbUtils';
import { VisitEntry } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const visitHistoryEntryMapper = (row: any): VisitEntry => {
	return {
		visitedUserId: getString(row['visited_user_id']),
		visitorUserId: getString(row['visitor_user_id'])
	};
};

const getVisitHistoryByVisitedId = async (visitedUserId: string): Promise<VisitEntry[] | undefined> => {
	const query = {
		text: 'select * from visit_history where visited_user_id = $1',
		values: [visitedUserId]
	};
	const res = await pool.query(query);
	if (!res.rowCount) {
		return undefined;
	}
	return res.rows.map((row) => visitHistoryEntryMapper(row));
};

const getVisitHistoryByVisitorId = async (visitorUserId: string): Promise<VisitEntry[] | undefined> => {
	const query = {
		text: 'select * from visit_history where visitor_user_id = $1',
		values: [visitorUserId]
	};
	const res = await pool.query(query);
	if (!res.rowCount) {
		return undefined;
	}
	return res.rows.map((row) => visitHistoryEntryMapper(row));
};

const addEntryToVisitHistory = async (visitedUserId: string, visitorUserId: string): Promise<boolean> => {
	const query = {
		text: 'insert into visit_history(visited_user_id, visitor_user_id) values($1, $2) on conflict do nothing',
		values: [visitedUserId, visitorUserId]
	};
	const res = await pool.query(query);
	if (!res.rowCount) {
		return false;
	}
	return true;
};

const clearVisitHistory = async (): Promise<void> => {
	await pool.query('truncate table visit_history');
};

export { getVisitHistoryByVisitedId, getVisitHistoryByVisitorId, addEntryToVisitHistory, clearVisitHistory };
