import pool from '../db';
import { getString } from '../dbUtils';
import { matchCheck, MatchEntry } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const matchEntryMapper = (row: any): MatchEntry => {
	return {
		matchId: getString(row['match_id']),
		matchedUserIdOne: getString(row['matched_user_one']),
		matchedUserIdTwo: getString(row['matched_user_two'])
	};
};

const getMatchesByUserId = async (matchedUserId: string): Promise<MatchEntry[]> => {
	const query = {
		text: 'select * from matches where matched_user_one = $1 or matched_user_two = $1 order by match_id desc',
		values: [matchedUserId]
	};
	const res = await pool.query(query);
	if (!res.rowCount) {
		return [];
	}
	return res.rows.map((row) => matchEntryMapper(row));
};

const getMatchByMatchId = async (matchId: string): Promise<MatchEntry | undefined> => {
	const query = {
		text: 'select * from matches where match_id = $1',
		values: [matchId]
	};
	const res = await pool.query(query);
	if (!res.rowCount) {
		return undefined;
	}
	return matchEntryMapper(res.rows[0]);
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

const removeMatchEntryWithReturn = async (matchedUserIdOne: string, matchedUserIdTwo: string): Promise<string | undefined> => {
	[matchedUserIdOne, matchedUserIdTwo] = matchedUserIdOne > matchedUserIdTwo ? [matchedUserIdTwo, matchedUserIdOne] : [matchedUserIdOne, matchedUserIdTwo];

	const query = {
		text: 'delete from matches where matched_user_one = $1 and matched_user_two = $2 returning match_id',
		values: [matchedUserIdOne, matchedUserIdTwo]
	};
	const res = await pool.query(query);
	if (!res.rowCount) {
		return undefined;
	}
	return getString(res.rows[0]['match_id']);
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
const checkMatchEntryWithReturn = async (matchedUserIdOne: string, matchedUserIdTwo: string): Promise<matchCheck> => {
	[matchedUserIdOne, matchedUserIdTwo] = matchedUserIdOne > matchedUserIdTwo ? [matchedUserIdTwo, matchedUserIdOne] : [matchedUserIdOne, matchedUserIdTwo];

	const query = {
		text: 'select * from matches where matched_user_one = $1 and matched_user_two = $2',
		values: [matchedUserIdOne, matchedUserIdTwo]
	};
	const res = await pool.query(query);
	if (!res.rowCount) {
		return {match: false, matchId: undefined };
	}
	return {match: true, matchId: getString(res.rows[0]['match_id'])};
};

const clearMatches = async (): Promise<void> => {
	await pool.query('truncate table matches');
};

export { getMatchesByUserId, addMatchEntry, removeMatchEntry, checkMatchEntry, clearMatches, getMatchByMatchId, removeMatchEntryWithReturn, checkMatchEntryWithReturn };
