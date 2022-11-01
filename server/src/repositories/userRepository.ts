import { User, NewUserWithHashedPwd } from '../types';

import pool from '../db';
import { getString, getDate } from '../dbUtils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const userMapper = (row: any): User => {
	return {
		id: getString(row['id']),
		username: getString(row['username']),
		email: getString(row['email']),
		passwordHash: getString(row['password_hash']),
		firstname: getString(row['firstname']),
		lastname: getString(row['lastname']),
		created_at: getDate(row['created_at'])
	};
};

const getAllUsers = async (): Promise<User[]> => {
	const res = await pool.query('select * from users');
	return res.rows.map(row => userMapper(row));
};

const addNewUser = async (newUser: NewUserWithHashedPwd): Promise<User> => {
	const query = {
		text: 'insert into users(username, email, password_hash, firstname, lastname) VALUES($1, $2, $3, $4, $5) RETURNING *',
		values: [newUser.username, newUser.email, newUser.passwordHash, newUser.firstname, newUser.lastname]
	};
	const res = await pool.query(query);
	return userMapper(res.rows[0]);
};

const findUserByUsername = async (username: string): Promise<User|undefined> => {
	const query = {
		text: 'select * from users where username = $1',
		values: [username]
	};
	const res = await pool.query(query);
	console.log(res.rowCount);
	if (!res.rowCount) {
		return undefined;
	}
	return userMapper(res.rows[0]);
};

const clearUsers = async (): Promise<void> => {
	await pool.query('truncate table users');
};

export { getAllUsers, addNewUser, clearUsers, findUserByUsername };
