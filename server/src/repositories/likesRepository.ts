import pool from '../db';
import { getString } from '../dbUtils';
import { LikeEntry } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const likeEntryMapper = (row: any): LikeEntry => {
	return {
		likedUserId: getString(row['liked_user_id']),
		likingUserId: getString(row['liking_user_id'])
	};
};

const getLikesByVisitedId = async (visitedUserId: string): Promise<LikeEntry[] | undefined> => {
	const query = {
		text: 'select * from likes_history where liked_user_id = $1',
		values: [visitedUserId]
	};
	const res = await pool.query(query);
	if (!res.rowCount) {
		return undefined;
	}
	return res.rows.map((row) => likeEntryMapper(row));
};

const getLikesByVisitorId = async (visitorUserId: string): Promise<LikeEntry[] | undefined> => {
	const query = {
		text: 'select * from likes_history where liking_user_id = $1',
		values: [visitorUserId]
	};
	const res = await pool.query(query);
	if (!res.rowCount) {
		return undefined;
	}
	return res.rows.map((row) => likeEntryMapper(row));
};

const checkLikeEntry = async (visitedUserId: string, visitorUserId: string): Promise<boolean> => {
	const query = {
		text: 'select * from likes_history where liked_user_id = $1 and liking_user_id = $2',
		values: [visitedUserId, visitorUserId]
	};
	const res = await pool.query(query);
	if (!res.rowCount) {
		return false;
	}
	return true;
};

const addLikeEntry = async (visitedUserId: string, visitorUserId: string): Promise<boolean> => {
	const query = {
		text: 'insert into likes_history(liked_user_id, liking_user_id) values($1, $2) on conflict do nothing',
		values: [visitedUserId, visitorUserId]
	};
	const res = await pool.query(query);
	if (!res.rowCount) {
		return false;
	}
	return true;
};

const removeLikeEntry = async (visitedUserId: string, visitorUserId: string): Promise<boolean> => {
	const query = {
		text: 'delete from likes_history where liked_user_id = $1 and liking_user_id = $2',
		values: [visitedUserId, visitorUserId]
	};
	const res = await pool.query(query);
	if (!res.rowCount) {
		return false;
	}
	return true;
};

const getLikesCount = async (visitedUserId: string): Promise<number> => {
	const query = {
		text: 'select * from likes_history where liked_user_id = $1',
		values: [visitedUserId]
	};
	const res = await pool.query(query);
	return res.rowCount;
};

const clearLikes = async (): Promise<void> => {
	await pool.query('truncate table likes_history');
};

export { getLikesByVisitedId, getLikesByVisitorId, addLikeEntry, checkLikeEntry, getLikesCount, removeLikeEntry, clearLikes };
