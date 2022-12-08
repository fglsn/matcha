import pool from '../db';
import { getString } from '../dbUtils';
import { BlockEntry } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const blockEntryMapper = (row: any): BlockEntry => {
	return {
		blockedUserId: getString(row['blocked_user_id']),
		blockingUserId: getString(row['blocking_user_id'])
	};
};

const getBlockedUsersByBlockingUserId = async (blockingUserId: string): Promise<BlockEntry[] | undefined> => {
	const query = {
		text: 'select * from block_entries where blocking_user_id = $1',
		values: [blockingUserId]
	};
	const res = await pool.query(query);
	if (!res.rowCount) {
		return undefined;
	}
	return res.rows.map((row) => blockEntryMapper(row));
};

const getListOfUsersWhoBlockedThisUser = async (blockedUserId: string): Promise<BlockEntry[] | undefined> => {
	const query = {
		text: 'select * from block_entries where blocked_user_id = $1',
		values: [blockedUserId]
	};
	const res = await pool.query(query);
	if (!res.rowCount) {
		return undefined;
	}
	return res.rows.map((row) => blockEntryMapper(row));
};

const checkBlockEntry = async (blockedUserId: string, blockingUserId: string): Promise<boolean> => {
	const query = {
		text: 'select * from block_entries where blocked_user_id = $1 and blocking_user_id = $2',
		values: [blockedUserId, blockingUserId]
	};
	const res = await pool.query(query);
	if (!res.rowCount) {
		return false;
	}
	return true;
};

const addBlockEntry = async (blockedUserId: string, blockingUserId: string): Promise<boolean> => {
	const query = {
		text: 'insert into block_entries(blocked_user_id, blocking_user_id) values($1, $2) on conflict do nothing',
		values: [blockedUserId, blockingUserId]
	};
	const res = await pool.query(query);
	if (!res.rowCount) {
		return false;
	}
	return true;
};

const removeBlockEntry = async (blockedUserId: string, blockingUserId: string): Promise<boolean> => {
	const query = {
		text: 'delete from block_entries where blocked_user_id = $1 and blocking_user_id = $2',
		values: [blockedUserId, blockingUserId]
	};
	const res = await pool.query(query);
	if (!res.rowCount) {
		return false;
	}
	return true;};

const clearBlockEntries = async (): Promise<void> => {
	await pool.query('truncate table block_entries');
};

export { getBlockedUsersByBlockingUserId, getListOfUsersWhoBlockedThisUser, checkBlockEntry, addBlockEntry, removeBlockEntry, clearBlockEntries };
