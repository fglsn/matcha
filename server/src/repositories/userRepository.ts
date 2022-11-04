import pool from '../db';
import { getString, getDate, getBoolean } from '../dbUtils';
import { ValidationError } from '../errors';
import { User, NewUserWithHashedPwd } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const userMapper = (row: any): User => {
	return {
		id: getString(row['id']),
		username: getString(row['username']),
		email: getString(row['email']),
		passwordHash: getString(row['password_hash']),
		firstname: getString(row['firstname']),
		lastname: getString(row['lastname']),
		createdAt: getDate(row['created_at']),
		isActive: getBoolean(row['is_active']),
		activationCode: getString(row['activation_code'])
	};
};

const getAllUsers = async (): Promise<User[]> => {
	const res = await pool.query('select * from users');
	return res.rows.map((row) => userMapper(row));
};

const addNewUser = async (newUser: NewUserWithHashedPwd): Promise<User> => {
	const query = {
		text: 'insert into users(username, email, password_hash, firstname, lastname, activation_code) VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
		values: [newUser.username, newUser.email, newUser.passwordHash, newUser.firstname, newUser.lastname, newUser.activationCode]
	};

	let res;
	try {
		res = await pool.query(query);
	} catch (error) {
		if (error instanceof Error) {
			if (error.message === 'duplicate key value violates unique constraint "users_username_key"') {
				throw new ValidationError('Username already exists');
			}
			if (error.message === 'duplicate key value violates unique constraint "users_email_key"') {
				throw new ValidationError('This email was already used');
			}
		}
		throw error;
	}

	return userMapper(res.rows[0]);
};

const findUserByUsername = async (username: string): Promise<User | undefined> => {
	const query = {
		text: 'select * from users where username = $1',
		values: [username]
	};
	const res = await pool.query(query);
	if (!res.rowCount) {
		return undefined;
	}
	return userMapper(res.rows[0]);
};

const findUserByActivationCode = async (activationCode: string): Promise<User | undefined> => {
	const query = {
		text: 'select * from users where activation_code = $1',
		values: [activationCode]
	};
	const res = await pool.query(query);
	if (!res.rowCount) {
		return undefined;
	}
	return userMapper(res.rows[0]);
};

const setUserAsActive = async (activationCode: string): Promise<void> => {
	const query = {
		text: 'update users set is_active = true where activation_code = $1',
		values: [activationCode]
	};
	await pool.query(query);
};

const clearUsers = async (): Promise<void> => {
	await pool.query('truncate table users');
};

export { getAllUsers, addNewUser, clearUsers, findUserByUsername, findUserByActivationCode, setUserAsActive };
