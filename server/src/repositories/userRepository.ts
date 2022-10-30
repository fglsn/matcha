import { User } from '../types';

import pool from '../db';
import { getNumber, getString } from '../dbUtils';

const getAllUsers = async (): Promise<User[]> => {
	const res = await pool.query('SELECT * FROM users');
	return res.rows.map((row) => {
		return {
			id: getNumber(row['id']),
			username: getString(row['username']),
			email: getString(row['email']),
			passwordHash: getString(row['password_hash']),
			firstname: getString(row['firstname']),
			lastname: getString(row['surname'])
		};
	});
};

// const addNewUser = async (): Promise<User> => {

// };

const clearUsers = async (): Promise<void> => {
	await pool.query('truncate table users');
};

export { getAllUsers, clearUsers };
