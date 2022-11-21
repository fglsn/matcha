import pool from '../db';
import { getString, getDate } from '../dbUtils';
import { EmailUpdateRequest } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const updateEmailRequestMapper = (row: any): EmailUpdateRequest => {
	return {
		token: getString(row['token']),
		userId: getString(row['user_id']),
		email: getString(row['email']),
		expiresAt: getDate(row['expires_at'])
	};
};

const addUpdateEmailRequest = async (userId: string, email: string): Promise<EmailUpdateRequest> => {
	const query = {
		text: 'insert into update_email_requests(user_id, email) values($1, $2) returning *',
		values: [userId, email]
	};
	const res = await pool.query(query);
	return updateEmailRequestMapper(res.rows[0]);
};

const findUpdateEmailRequestByUserId = async (userId: string): Promise<EmailUpdateRequest | undefined> => {
	const query = {
		text: 'select * from update_email_requests where user_id = $1',
		values: [userId]
	};

	const res = await pool.query(query);
	if (!res.rowCount) {
		return undefined;
	}
	return updateEmailRequestMapper(res.rows[0]);
};

const findUpdateEmailRequestByToken = async (token: string): Promise<EmailUpdateRequest | undefined> => {
	const query = {
		text: 'select * from update_email_requests where token = $1',
		values: [token]
	};

	const res = await pool.query(query);
	if (!res.rowCount) {
		return undefined;
	}
	return updateEmailRequestMapper(res.rows[0]);
};

const removeUpdateEmailRequest = async (token: string): Promise<void> => {
	const query = {
		text: 'delete from update_email_requests where token=$1',
		values: [token]
	};
	await pool.query(query);
};

const removeUpdateEmailRequestByUserId = async (userId: string): Promise<void> => {
	const query = {
		text: 'delete from update_email_requests where user_id=$1',
		values: [userId]
	};
	await pool.query(query);
};

const clearExpiredUpdateEmailRequests = async (): Promise<void> => {
	await pool.query('delete * from update_email_requests where expires_at < now()');
};

const clearUpdateEmailRequestsTable = async (): Promise<void> => {
	await pool.query('truncate table update_email_requests');
};

export {
	addUpdateEmailRequest,
	removeUpdateEmailRequest,
	removeUpdateEmailRequestByUserId,
	findUpdateEmailRequestByUserId,
	findUpdateEmailRequestByToken,
	clearUpdateEmailRequestsTable,
	clearExpiredUpdateEmailRequests
};
