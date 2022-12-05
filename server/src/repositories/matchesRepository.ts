import pool from '../db';
import { getString } from '../dbUtils';
import { MatchEntry } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const matchEntryMapper = (row: any): MatchEntry => {
	return {
		matchedUserIdOne: getString(row['matched_user_one']),
		matchedUserIdTwo: getString(row['matched_user_two'])
	};
};

const getMatchesByUserId = async (matchedUserId: string): Promise<MatchEntry[] | undefined> => {
	const query = {
		text: 'select * from matches where matched_user_one = $1 or matched_user_two = $1',
		values: [matchedUserId]
	};
	const res = await pool.query(query);
	if (!res.rowCount) {
		return undefined;
	}
	return res.rows.map((row) => matchEntryMapper(row));
};

const addMatchEntry = async (matchedUserIdOne: string, matchedUserIdTwo: string): Promise<MatchEntry | undefined> => {
	[matchedUserIdOne, matchedUserIdTwo] = matchedUserIdOne > matchedUserIdTwo ? [matchedUserIdTwo, matchedUserIdOne] : [matchedUserIdOne, matchedUserIdTwo];

	const query = {
		text: 'insert into matches(matched_user_one, matched_user_two) values($1, $2) on conflict do nothing returning *',
		values: [matchedUserIdOne, matchedUserIdTwo]
	};
	const res = await pool.query(query);
	if (!res.rowCount) {
		return undefined;
	}
	return matchEntryMapper(res.rows[0]);
};

const removeMatchEntry = async (matchedUserIdOne: string, matchedUserIdTwo: string): Promise<void> => {
	[matchedUserIdOne, matchedUserIdTwo] = matchedUserIdOne > matchedUserIdTwo ? [matchedUserIdTwo, matchedUserIdOne] : [matchedUserIdOne, matchedUserIdTwo];

	const query = {
		text: 'delete from matches where matched_user_one = $1 and matched_user_two = $2',
		values: [matchedUserIdOne, matchedUserIdTwo]
	};
	await pool.query(query);
};

const checkMatchEntry = async (matchedUserIdOne: string, matchedUserIdTwo: string): Promise<boolean> => {
	[matchedUserIdOne, matchedUserIdTwo] = matchedUserIdOne > matchedUserIdTwo ? [matchedUserIdTwo, matchedUserIdOne] : [matchedUserIdOne, matchedUserIdTwo];

	const query = {
		text: 'select * from matches where matched_user_one = $1 and matched_user_two = $2',
		values: [matchedUserIdOne, matchedUserIdTwo]
	};
	const res = await pool.query(query);
	if (!res.rowCount) {
		return false;
	}
	return true;
};

export { getMatchesByUserId, addMatchEntry, removeMatchEntry, checkMatchEntry };
