/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from "../types";
import { QueryResult } from "pg";

import pool from "../../db";

const getAllUsers = (): QueryResult<User[]> | void=> {
	const users = pool.query('SELECT * FROM users', (err, res) => {
		if (err) {
			throw err;
		}
		console.log('user:', res.rows[0]);
		console.log('user:', res.rows[1]);
		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return (res.rows);
	});
	return users;
};

export default { getAllUsers };