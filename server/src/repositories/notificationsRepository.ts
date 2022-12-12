import pool from '../db';
import { getString } from '../dbUtils';
import { NotificationEntry } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const notificationEntryMapper = (row: any): NotificationEntry => {
	return {
		notified_user_id: getString(row['notified_user_id']),
		acting_user_id: getString(row['acting_user_id']),
		type: getString(row['type'])
	};
};

const getNotificationsByNotifiedUserId = async (notified_user_id: string): Promise<NotificationEntry[] | undefined> => {
	const query = {
		text: `
				select * from notification_entries 
				where notified_user_id = $1
				order by id desc
			`,
		values: [notified_user_id]
	};
	const res = await pool.query(query);
	if (!res.rowCount) {
		return undefined;
	}
	return res.rows.map((row) => notificationEntryMapper(row));
};

const getNotificationsPageByNotifiedUserId = async (notified_user_id: string, page: number, limit: number): Promise<NotificationEntry[] | undefined> => {
	if (page <= 0 || limit <= 0) return undefined;
	const offset = (page - 1) * limit;

	const query = {
		text: `
            select * from notification_entries 
            where notified_user_id = $1 
            order by id desc limit $2 offset $3
        `,
		values: [notified_user_id, limit, offset]
	};
	const res = await pool.query(query);
	if (!res.rowCount) {
		return undefined;
	}
	return res.rows.map((row) => notificationEntryMapper(row));
};

const getNotificationByActingUserId = async (acting_user_id: string): Promise<NotificationEntry[] | undefined> => {
	const query = {
		text: 'select * from notification_entries where acting_user_id = $1',
		values: [acting_user_id]
	};
	const res = await pool.query(query);
	if (!res.rowCount) {
		return undefined;
	}
	return res.rows.map((row) => notificationEntryMapper(row));
};

const addNotificationEntry = async (notified_user_id: string, acting_user_id: string, type: string): Promise<void> => {
	const query = {
		text: 'insert into notification_entries(notified_user_id, acting_user_id, type) values($1, $2, $3)',
		values: [notified_user_id, acting_user_id, type]
	};
	await pool.query(query);
};

const clearNotifications = async (): Promise<void> => {
	await pool.query('truncate table notification_entries');
};

export { getNotificationsByNotifiedUserId, getNotificationByActingUserId, addNotificationEntry, getNotificationsPageByNotifiedUserId, clearNotifications };
