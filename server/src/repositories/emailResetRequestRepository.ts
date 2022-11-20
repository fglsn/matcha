import pool from '../db';
import { getString, getDate } from '../dbUtils';
import { EmailUpdateRequest } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const emailResetRequestMapper = (row: any): EmailUpdateRequest => {
	return {
		token: getString(row['token']),
		userId: getString(row['user_id']),
		email: getString(row['email']),
		expiresAt: getDate(row['expires_at'])
	};
};

const addEmailResetRequest = async (userId: string, email: string): Promise<EmailUpdateRequest> => {
	const query = {
		text: 'insert into email_reset_requests(user_id, email) values($1, $2) returning *',
		values: [userId, email]
	};
	const res = await pool.query(query);
	return emailResetRequestMapper(res.rows[0]);
};

const findEmailResetRequestByUserId = async (userId: string): Promise<EmailUpdateRequest | undefined> => {
	const query = {
		text: 'select * from email_reset_requests where user_id = $1',
		values: [userId]
	};

	const res = await pool.query(query);
	if (!res.rowCount) {
		return undefined;
	}
	return emailResetRequestMapper(res.rows[0]);
};

const findEmailResetRequestByToken = async (token: string): Promise<EmailUpdateRequest | undefined> => {
	const query = {
		text: 'select * from email_reset_requests where token = $1',
		values: [token]
	};

	const res = await pool.query(query);
	if (!res.rowCount) {
		return undefined;
	}
	return emailResetRequestMapper(res.rows[0]);
};

const removeEmailResetRequest = async (token: string): Promise<void> => {
	const query = {
		text: 'delete from email_reset_requests where token=$1',
		values: [token]
	};
	await pool.query(query);
};

const removeEmailResetRequestByUserId = async (userId: string): Promise<void> => {
	const query = {
		text: 'delete from email_reset_requests where user_id=$1',
		values: [userId]
	};
	await pool.query(query);
};

const clearExpiredEmailResetRequests = async (): Promise<void> => {
	await pool.query('delete * from email_reset_requests where expires_at < now()');
};

const clearEmailResetRequestsTable = async (): Promise<void> => {
	await pool.query('truncate table email_reset_requests');
};

export {
	addEmailResetRequest,
	removeEmailResetRequest,
	removeEmailResetRequestByUserId,
	findEmailResetRequestByUserId,
	findEmailResetRequestByToken,
	clearEmailResetRequestsTable,
	clearExpiredEmailResetRequests
};
