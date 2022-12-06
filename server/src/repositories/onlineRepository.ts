import pool from '../db';
import { getString } from '../dbUtils';
import { IOnlineUser } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const userOnlineMapper = (row: any): IOnlineUser => {
	return {
		user_id: getString(row['user_id']),
        active: Number(getString(row['active']))
	};
};

const addUserOnline = async (user_id: string, active: number): Promise<void> => {
	const query = {
		text: "insert into users_online(user_id, active) values($1, $2) on conflict (user_id) do update set active = $2",
		values: [user_id, active]
	};
	await pool.query(query);
};

const updateUserOnline = async (user_id: string, active: number): Promise<void> => {
	const query = {
		text: 'update users_online set active=$2 where user_id=$1',
		values: [user_id, active]
	};
	await pool.query(query);
};

const getOnlineUser = async (user_id: string): Promise<IOnlineUser | undefined> => {
	const query = {
		text: 'select * from users_online where user_id=$1',
		values: [user_id]
	};
    const res = await pool.query(query);
	if (!res.rowCount) {
		return undefined;
	}
	return userOnlineMapper(res.rows[0]);
};

export {addUserOnline, updateUserOnline, getOnlineUser};