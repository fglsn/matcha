import { User } from '../types';

import pool from '../db';
import { getNumber, getString } from '../dbUtil';

const getAllUsers = async (): Promise<User[]> => {
	const result = await pool.query('SELECT * FROM users');
	return result.rows.map((row) => {
		return {
			id: getNumber(row['id']),
			username: getString(row['username']),
			email: getString(row['email']),
			password: getString(row['password_hash']),
			firstname: getString(row['firstname']),
			surname: getString(row['surname'])
		};
	});
};

export default { getAllUsers };
