import { NewUser, User, UserWithoutId } from '../types';

import pool from '../db';
import { getNumber, getString } from '../dbUtils';

const getAllUsers = async (): Promise<User[]> => {
	const res = await pool.query('select * from users');
	return res.rows.map((row) => {
		//create user mapper func
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

// const findUserByUsername = async (username): Promise<User> => {
// 	const query = {
// 		text: 'select * from users where username = $1',
// 		values: [username]
// 	};
// 	const res = await pool.query(query);
// 	return {
// 		todo: return userMapper(res);
// 	}
// };

const addNewUser = async (newUser: NewUserWithHashedPwd): Promise<User> => {
	const query = {
		text: 'insert into users(username, email, password_hash, firstname, lastname) VALUES($1, $2, $3, $4, $5)',
		values: [newUser.username, newUser.email, newUser.passwordHash, newUser.firstname, newUser.lastname]
	};
	const res = await pool.query(query);
//	return {
// 		todo: return userMapper(res);
// 	}
};

const clearUsers = async (): Promise<void> => {
	await pool.query('truncate table users');
};

export { getAllUsers, addNewUser, clearUsers };
