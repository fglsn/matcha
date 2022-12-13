import pool from '../db';
import { getString, getDate, getBoolean, getStringOrUndefined, getBdDateOrUndefined, getStringArrayOrUndefined, getNumber } from '../dbUtils';
import { User, NewUserWithHashedPwd, UserData, UpdateUserProfile, UserCompletness, UserEntry, Orientation, Gender } from '../types';
import { ValidationError } from '../errors';
import { assertNever } from '../utils/helpers';

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
		coordinates: { lat: getNumber(row['lat']), lon: getNumber(row['lon']) },
		location: getString(row['location_string']),
		complete: getBoolean(row['is_complete']),
		reportsCount: getNumber(row['reports_count']),
		fameRating: getNumber(row['fame_rating'])
	};
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const userCompletnessMapper = (row: any): UserCompletness => {
	return {
		complete: getBoolean(row['is_complete'])
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
		coordinates: { lat: getNumber(row['lat']), lon: getNumber(row['lon']) },
		location: getString(row['location_string']),
		fameRating: getNumber(row['fame_rating'])
	};
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const idMapper = (row: any): { id: string } => {
	return { id: getString(row['id']) };
};

//for tests
const getAllUsers = async (): Promise<User[]> => {
	const res = await pool.query('select * from users');
	return res.rows.map((row) => userMapper(row));
};

const getIdList = async (): Promise<{ id: string }[]> => {
	const res = await pool.query('select id from users');
	return res.rows.map((row) => idMapper(row));
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
		text: 'select id, username, firstname, lastname, birthday, gender, orientation, bio, tags, lat, lon, location_string, fame_rating from users where id = $1',
		values: [userId]
	};
	const res = await pool.query(query);
	if (!res.rowCount) {
		return undefined;
	}
	return userDataMapper(res.rows[0]);
};

const getCompletenessByUserId = async (userId: string): Promise<UserCompletness | undefined> => {
	const query = {
		text: 'select is_complete from users where id = $1',
		values: [userId]
	};
	const res = await pool.query(query);
	if (!res.rowCount) {
		return undefined;
	}
	return userCompletnessMapper(res.rows[0]);
};

const updateCompletenessByUserId = async (userId: string, value: boolean): Promise<void> => {
	const query = {
		text: 'update users set is_complete = $2 where id = $1',
		values: [userId, value]
	};
	await pool.query(query);
};

const userDataIsNotNULL = async (userId: string): Promise<boolean> => {
	const query = {
		text: 'select * from users where id = $1 and birthday is not null and gender is not null and orientation is not null and bio is not null and tags is not null',
		values: [userId]
	};
	const res = await pool.query(query);
	if (!res.rowCount) {
		return false;
	}
	return true;
};

const userHasPhotos = async (userId: string): Promise<boolean> => {
	const query = {
		text: 'select * from photos where user_id = $1',
		values: [userId]
	};
	const res = await pool.query(query);
	if (!res.rowCount) {
		return false;
	}
	return true;
};

const increaseReportCount = async (userId: string): Promise<number> => {
	const query = {
		text: 'update users set reports_count = reports_count + 1 where id = $1 returning reports_count',
		values: [userId]
	};
	const res = await pool.query(query);
	return <number>res.rows[0]['reports_count'];
};

const getReportCount = async (userId: string): Promise<number> => {
	const query = {
		text: 'select reports_count from users where id = $1 returning reports_count',
		values: [userId]
	};
	const res = await pool.query(query);
	return <number>res.rows[0]['reports_count'];
};

const getFameRatingByUserId = async (userId: string): Promise<number> => {
	const query = {
		text: 'select fame_rating from users where id = $1',
		values: [userId]
	};
	const res = await pool.query(query);
	return <number>res.rows[0]['fame_rating'];
};

const updateFameRatingByUserId = async (userId: string, points: number): Promise<number> => {
	const query = {
		text: `
			update users
			set fame_rating = (case
								when fame_rating + $2 >= 100 then 100
								when fame_rating + $2 <= 0 then 0
								else fame_rating + $2 end)
			where id = $1
			returning fame_rating
		`,
		values: [userId, points]
	};
	const res = await pool.query(query);
	return <number>res.rows[0]['fame_rating'];
};

const getTagsByUserId = async (userId: string): Promise<string[] | undefined> => {
	const query = {
		text: 'select tags from users where id = $1',
		values: [userId]
	};
	const res = await pool.query(query);
	return getStringArrayOrUndefined(res.rows[0]['tags']);
};

const updateUserDataByUserId = async (userId: string, updatedProfile: UpdateUserProfile): Promise<void> => {
	const query = {
		text: 'update users set firstname = $2, lastname = $3, birthday = $4, gender = $5, orientation = $6, bio = $7, tags = $8, lat = $9, lon = $10, location_string = $11 where id = $1',
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
			updatedProfile.coordinates.lon,
			updatedProfile.location
		]
	};
	await pool.query(query);
};

const findUsernameById = async (userId: string): Promise<string | undefined> => {
	const query = {
		text: 'select username from users where id = $1',
		values: [userId]
	};

	const res = await pool.query(query);

	if (!res.rowCount) {
		return undefined;
	}
	return getString(res.rows[0]['username']);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const userEntryMapper = (row: any): UserEntry => {
	const photo_type = getString(row['photo_type']);
	const photo = getString(row['photo']);
	const image = `data:${photo_type};base64,${photo}`;
	return {
		id: getString(row['users_id']),
		username: getString(row['username']),
		avatar: image
	};
};

const getUserEntries = async (idList: string[]): Promise<UserEntry[]> => {
	const query = {
		text: `select distinct on (users.id) users.id as users_id, users.username, photos.photo, photos.photo_type, photos.id as photos_id
				from users
					join photos on users.id = photos.user_id
				where users.id = any ($1 :: int[])
				order by users.id, photos.id`,
		values: [idList]
	};
	const res = await pool.query(query);
	if (!res.rowCount) {
		return [];
	}
	return res.rows.map((row) => {
		return userEntryMapper(row);
	});
};

const getInitialMatchSuggestions = async (userId: string, gender: Gender, orientation: Orientation): Promise<UserData[]> => {

	const oppositeGender = gender === 'male' ? 'female' : 'male';

	let sexualPreference;
	switch (orientation) {
		case 'straight':
			sexualPreference = `(gender = '${oppositeGender}' and orientation = 'straight') or (gender = '${oppositeGender}' and orientation = 'bi')`;
			break;
		case 'gay':
			sexualPreference = `(gender = '${gender}' and orientation = 'gay') or (gender = '${gender}' and orientation = 'bi')`;
			break;
		case 'bi':
			sexualPreference = `(gender = '${oppositeGender}' and orientation = 'straight') or (gender = '${oppositeGender}' and orientation = bi)
				or (gender = '${gender}' and orientation = 'bi') or (gender = '${gender}' and orientation = 'gay')`;
			break;
		default:
			assertNever(orientation);
	}

	const query = {
		text:
			`select id, username, firstname, lastname, birthday, gender, orientation, bio, tags, lat, lon, location_string, fame_rating 
				from users
				left join likes_history on likes_history.liked_user_id = users.id and likes_history.liking_user_id = $1
				left join block_entries on block_entries.blocked_user_id = users.id and block_entries.blocking_user_id = $1
				left join report_entries on report_entries.reported_user_id = users.id and report_entries.reporting_user_id = $1
				where id != $1 and 
					likes_history.liked_user_id is null and 
					block_entries.blocked_user_id is null and 
					report_entries.reported_user_id is null and (` +
			sexualPreference +
			')',
		values: [userId]
	};
	const res = await pool.query(query);
	if (!res.rowCount) {
		return [];
	}
	return res.rows.map((row) => {
		return userDataMapper(row);
	});
};

export {
	getAllUsers,
	getIdList,
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
	isUserById,
	getCompletenessByUserId,
	userDataIsNotNULL,
	userHasPhotos,
	updateCompletenessByUserId,
	increaseReportCount,
	getReportCount,
	findUsernameById,
	getFameRatingByUserId,
	updateFameRatingByUserId,
	getTagsByUserId,
	getUserEntries,
	getInitialMatchSuggestions
};
