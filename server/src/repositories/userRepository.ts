import { User } from "../types";

import pool from "../db";
import { getString } from "../dbUtil";

const getAllUsers = async (): Promise<User[]> => {
	const result = await pool.query('SELECT * FROM users');
	return result.rows.map(row => {
		return {
			username: getString(row['username']),
			password: getString(row['password']),
		};
	});
};

export default { getAllUsers };