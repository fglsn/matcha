import pool from '../db';

const addNotificationsQueueEntry = async (notified_user_id: string): Promise<void> => {
	const query = {
		text: 'insert into notifications_queue(notified_user_id) values($1)',
		values: [notified_user_id]
	};
	await pool.query(query);
};

const getNotificationsQueueCount = async (notified_user_id: string): Promise<number> => {
	const query = {
		text: 'select * from notifications_queue where notified_user_id = $1',
		values: [notified_user_id]
	};
	const res = await pool.query(query);
	return res.rowCount;
};

const removeNotificationsQueueById = async (notified_user_id: string): Promise<boolean> => {
	const query = {
		text: 'delete from notifications_queue where notified_user_id = $1',
		values: [notified_user_id]
	};
	const res = await pool.query(query);
	if (!res.rowCount) {
		return false;
	}
	return true;
};

export { addNotificationsQueueEntry, getNotificationsQueueCount, removeNotificationsQueueById };
