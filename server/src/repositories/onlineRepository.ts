import pool from '../db';
// import { getNumber } from '../dbUtils';


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

const isOnlineUser = async (user_id: string, active: number): Promise<void> => {
	const query = {
		text: 'select * where user_id=$1',
		values: [user_id, active]
	};
	await pool.query(query);
};

export {addUserOnline, updateUserOnline, isOnlineUser};