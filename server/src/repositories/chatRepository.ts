import pool from '../db';
import { getDate, getString } from '../dbUtils';
import { ChatMsg } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const messageEntryMapper = (row: any)  => {
	return {
		receiver_id: getString(row['receiver_id']),
		sender_id: getString(row['sender_id']),
        message_text:  getString(row['message_text']),
		message_time: getDate(row['message_time'])
	};
};

const getMessagesByID = async (sender_id: string, receiver_id: string, page = 1, limit: number | 'ALL' = 'ALL'): Promise<ChatMsg[]>  => {
    
    if (page <= 0 || (limit !== 'ALL' && limit <= 0)) return [];
	
    const offset = limit !== 'ALL' ? (page - 1) * limit : 0;

	const query = {
		text: `
            select * from chat_messages 
            where 
            sender_id = $1 and receiver_id = $2 
            or 
            sender_id = $2 and receiver_id = $1
            order by message_time desc limit $3 offset $4
        `,
		values: [sender_id, receiver_id, limit, offset]
	};

	const res = await pool.query(query);
	if (!res.rowCount) {
		return [];
	}
	return res.rows.map((row) => messageEntryMapper(row));
};

const addMessageEntry = async (sender_id: string, receiver_id: string, message_text: string): Promise<ChatMsg | undefined> => {
	const query = {
		text: 'insert into chat_messages(sender_id, receiver_id, message_text) values($1, $2, $3) returning *',
		values: [sender_id, receiver_id, message_text]
	};
	
    const res = await pool.query(query);
    if (!res.rowCount) {
		return undefined;
	}
	return messageEntryMapper(res.rows[0]);
};

const clearMessages = async (): Promise<void> => {
	await pool.query('truncate table chat_messages');
};

export {messageEntryMapper, getMessagesByID, addMessageEntry, clearMessages};