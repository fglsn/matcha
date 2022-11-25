import pool from '../db';
import { getString, getDate, getBoolean, getStringOrUndefined, getBdDateOrUndefined, getStringArrayOrUndefined, getNumber } from '../dbUtils';
import { ValidationError } from '../errors';
import { User, NewUserWithHashedPwd, UserData, UpdateUserProfile } from '../types';

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
		activationCode: getString(row['activation_code']),
		coordinates: { lat: getNumber(row['lat']), lon: getNumber(row['lon']) }
	};
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const userDataMapper = (row: any): UserData => {
	return {
		id: getString(row['id']),
		username: getString(row['username']),
		firstname: getString(row['firstname']),
		lastname: getString(row['lastname']),
		birthday: getBdDateOrUndefined(row['birthday']),
		gender: getStringOrUndefined(row['gender']),
		orientation: getStringOrUndefined(row['orientation']),
		bio: getStringOrUndefined(row['bio']),
		tags: getStringArrayOrUndefined(row['tags']),
		coordinates: { lat: getNumber(row['lat']), lon: getNumber(row['lon']) }
	};
};

//for tests
const getAllUsers = async (): Promise<User[]> => {
	const res = await pool.query('select * from users');
	return res.rows.map((row) => userMapper(row));
};

const getPasswordHash = async (userId: string): Promise<string> => {
	const res = await pool.query({ text: 'select password_hash from users where id = $1', values: [userId] });
	return getString(res.rows[0]['password_hash']);
};

const addNewUser = async (newUser: NewUserWithHashedPwd): Promise<User> => {
	const query = {
		text: 'insert into users(username, email, password_hash, firstname, lastname, activation_code, lat, lon) values($1, $2, $3, $4, $5, $6, $7, $8) returning *',
		values: [newUser.username, newUser.email, newUser.passwordHash, newUser.firstname, newUser.lastname, newUser.activationCode, newUser.lat, newUser.lon]
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

const isUserById = async (id: string): Promise<boolean> => {
	const query = {
		text: 'select username from users where id = $1',
		values: [id]
	};
	const res = await pool.query(query);
	if (!res.rowCount) {
		return false;
	}
	return true;
};

const findUserByEmail = async (email: string): Promise<User | undefined> => {
	const query = {
		text: 'select * from users where email = $1',
		values: [email]
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

const updateUserPassword = async (userId: string, passwordHash: string): Promise<void> => {
	const query = {
		text: 'update users set password_hash = $1 where id = $2',
		values: [passwordHash, userId]
	};
	await pool.query(query);
};

const updateUserEmail = async (userId: string, email: string): Promise<void> => {
	const query = {
		text: 'update users set email = $1 where id = $2',
		values: [email, userId]
	};
	try {
		await pool.query(query);
	} catch (error) {
		if (error instanceof Error) {
			if (error.message === 'duplicate key value violates unique constraint "users_email_key"') {
				throw new ValidationError('This email was already used');
			}
		}
		throw error;
	}
};

const clearUsers = async (): Promise<void> => {
	await pool.query('truncate table users');
};

const getUserDataByUserId = async (userId: string): Promise<UserData | undefined> => {
	const query = {
		text: 'select id, username, email, firstname, lastname, birthday, gender, orientation, bio, tags, lat, lon from users where id = $1',
		values: [userId]
	};
	const res = await pool.query(query);
	if (!res.rowCount) {
		return undefined;
	}
	return userDataMapper(res.rows[0]);
};

const updateUserDataByUserId = async (userId: string, updatedProfile: UpdateUserProfile): Promise<void> => {
	const query = {
		text: 'update users set firstname = $2, lastname = $3, birthday = $4, gender = $5, orientation = $6, bio = $7, tags = $8, lat = $9, lon = $10 where id = $1',
		values: [
			userId,
			updatedProfile.firstname,
			updatedProfile.lastname,
			updatedProfile.birthday,
			updatedProfile.gender,
			updatedProfile.orientation,
			updatedProfile.bio,
			updatedProfile.tags,
			updatedProfile.coordinates.lat,
			updatedProfile.coordinates.lon
		]
	};
	await pool.query(query);
};

export {
	getAllUsers,
	getPasswordHash,
	addNewUser,
	clearUsers,
	findUserByUsername,
	findUserByActivationCode,
	setUserAsActive,
	findUserByEmail,
	updateUserPassword,
	updateUserEmail,
	getUserDataByUserId,
	updateUserDataByUserId,
	isUserById
};
