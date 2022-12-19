import pool from '../db';
import { getString } from '../dbUtils';
import { MessageNotification } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const chatNotificationMapper = (row: any): MessageNotification => {
	return {
		matchId: getString(row['match_id']),
		senderId: getString(row['sender_id']),
		receiverId: getString(row['receiver_id'])
	};
};

const getChatNotificationsByReceiver = async (receiverId: string): Promise<MessageNotification[]> => {
	const query = {
		text: `
				select * from chat_notifications 
				where receiver_id = $1
			`,
		values: [receiverId]
	};
	const res = await pool.query(query);
	if (!res.rowCount) {
		return [];
	}
	return res.rows.map((row) => chatNotificationMapper(row));
};

const addChatNotificationsEntry = async (matchId: string, senderId: string, receiverId: string): Promise<MessageNotification | undefined> => {
	const query = {
		text: 'insert into chat_notifications(match_id, sender_id, receiver_id) values($1, $2, $3) returning *',
		values: [matchId, senderId, receiverId]
	};
	const res = await pool.query(query);
	if (!res.rowCount) {
		return undefined;
	}
	return chatNotificationMapper(res.rows[0]);
};

const deleteNotificationsByMatchAndReceiver = async (matchId: string, receiverId: string): Promise<void> => {
	const query = {
		text: 'delete from chat_notifications where match_id = $1 and receiver_id = $2',
		values: [matchId, receiverId]
	};
	await pool.query(query);
};

const deleteNotificationsByMatchId = async (senderId: string, receiverId: string): Promise<void> => {
	const query = {
		text: `
                delete from chat_notifications 
                where sender_id = $1 and receiver_id = $2
                or sender_id = $2 and receiver_id = $1
        `,
		values: [senderId, receiverId]
	};
	await pool.query(query);
};

const clearNotifications = async (): Promise<void> => {
	await pool.query('truncate table chat_notifications');
};

export { getChatNotificationsByReceiver, addChatNotificationsEntry, clearNotifications, deleteNotificationsByMatchAndReceiver, deleteNotificationsByMatchId };
