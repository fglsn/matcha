import pool from '../db';
import { getString, getDate } from '../dbUtils';
import { PasswordResetRequest } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const passwordResetRequestMapper = (row: any): PasswordResetRequest => {
	return {
		token: getString(row['token']),
		userId: getString(row['user_id']),
		expiresAt: getDate(row['expires_at'])
	};
};

const addPasswordResetRequest = async (userId: string): Promise<PasswordResetRequest> => {
	const query = {
		text: 'insert into password_reset_requests(user_id) values($1) returning *',
		values: [userId]
	};
	const res = await pool.query(query);
	return passwordResetRequestMapper(res.rows[0]);
};

const findPasswordResetRequestByUserId = async (userId: string): Promise<PasswordResetRequest | undefined> => {
	const query = {
		text: 'select * from password_reset_requests where user_id = $1',
		values: [userId]
	};

	const res = await pool.query(query);
	if (!res.rowCount) {
		return undefined;
	}
	return passwordResetRequestMapper(res.rows[0]);
};

// const updatePasswordResetRequest = async (userId: string): Promise<PasswordResetRequest | undefined> => {
// 	const query = {
// 		text: 'update password_reset_requests set user_id = $1 where user_id = $1 returning *',
// 		values: [userId]
// 	};

// 	const res = await pool.query(query);
// 	if (!res.rowCount) {
// 		return undefined;
// 	}
// 	return passwordResetRequestMapper(res.rows[0]);
// };

const removePasswordResetRequest = async (token: string): Promise<void> => {
	const query = {
		text: 'delete from password_reset_requests where token=$1',
		values: [token]
	};
	await pool.query(query);
};

const clearExpiredPasswordResetRequests= async (): Promise<void> => {
	await pool.query('delete * from password_reset_requests where expires_at < now()');
};

export { addPasswordResetRequest, findPasswordResetRequestByUserId, removePasswordResetRequest, clearExpiredPasswordResetRequests };