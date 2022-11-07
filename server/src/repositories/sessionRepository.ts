import pool from '../db';
import { getString, getDate } from '../dbUtils';
import { NewSessionUser, Session } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sessionMapper = (row: any): Session => {
	return {
		sessionId: getString(row['session_id']),
		userId: getString(row['user_id']),
		username: getString(row['username']),
		email: getString(row['email']),
		expiresAt: getDate(row['expires_at'])
	};
};

const addSession = async (newSessionUser: NewSessionUser): Promise<Session> => {
	const query = {
		text: 'insert into user_sessions(user_id, username, email) values($1, $2, $3) returning *',
		values: [newSessionUser.userId, newSessionUser.username, newSessionUser.email]
	};

	const res = await pool.query(query);
	return sessionMapper(res.rows[0]);
};

const getSessionIdByUserId = async (userId: string): Promise<Session[] | undefined> => {
	const query = {
		text: 'select * from user_sessions where user_id = $1',
		values: [userId]
	};

	const res = await pool.query(query);
	if (!res.rowCount) {
		return undefined;
	}
	return res.rows.map(row => sessionMapper(row));

};
export { addSession, getSessionIdByUserId };
