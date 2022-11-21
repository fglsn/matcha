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

const findSessionBySessionId = async (sessionId: string): Promise<Session | undefined> => {
	const query = {
		text: 'select * from user_sessions where session_id = $1 and expires_at > now()',
		values: [sessionId]
	};

	const res = await pool.query(query);
	if (!res.rowCount) {
		return undefined;
	}
	return sessionMapper(res.rows[0]);
};

const findSessionsByUserId = async (userId: string): Promise<Session[] | undefined> => {
	const query = {
		text: 'select * from user_sessions where user_id = $1 and expires_at > now()',
		values: [userId]
	};

	const res = await pool.query(query);
	if (!res.rowCount) {
		return undefined;
	}
	return res.rows.map((row) => sessionMapper(row));
};

const clearSessions = async (): Promise<void> => {
	await pool.query('truncate table user_sessions');
};

const clearExpiredSessions = async (): Promise<void> => {
	await pool.query('delete * from user_sessions where expires_at < now()');
};

const updateSessionEmailByUserId = async (userId: string, email: string): Promise<void> => {
	const query = {
		text: 'update user_sessions set email = $1 where user_id = $2',
		values: [email, userId]
	};
	await pool.query(query);
};

export { addSession, findSessionBySessionId, findSessionsByUserId, clearSessions, clearExpiredSessions, updateSessionEmailByUserId };
