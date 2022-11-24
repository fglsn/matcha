import pool from '../db';
import { Images, Photo } from '../types';
import { getString } from '../dbUtils';
import { AppError } from '../errors';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const photosMapper = (rows: any): Images => {
	const images = [];
	for (let i = 0; i < rows.length; i++) {
		const photo_type = getString(rows[i]['photo_type']);
		const photo = getString(rows[i]['photo']);
		const image = `data:${photo_type};base64,${photo}`;
		images.push({ dataURL: image });
	}
	return { images: images };
};

const addPhotoByUserId = async (userId: string, image: Photo): Promise<void> => {
	const query = {
		text: 'insert into photos(photo_type, photo, user_id) values($1, $2, $3)',
		values: [image.imageType, image.dataBase64, userId]
	};

	await pool.query(query);
};
const updatePhotoByUserId = async (userId: string, images: Photo[]): Promise<void> => {
	
	try { 
		await pool.query('BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE');
		await dropPhotosByUserId(userId);
		for (let i = 0; i < images.length; i++) {
			await addPhotoByUserId(userId, images[i]);
		}
		await pool.query('COMMIT');
	} catch (e) {
		await pool.query('ROLLBACK');
		throw new AppError('Failed to upload photos! Please, try again', 500);
	}
};

const dropPhotosByUserId = async (userId: string): Promise<void> => {
	const query = {
		text: 'delete from photos where user_id=$1',
		values: [userId]
	};

	await pool.query(query);
};

const getPhotosByUserId = async (userId: string): Promise<Images> => {
	const query = {
		text: 'select * from photos where user_id=$1',
		values: [userId]
	};

	const res = await pool.query(query);
	if (!res.rowCount) {
		return { images: undefined };
	}
	return photosMapper(res.rows);
};

export { addPhotoByUserId, dropPhotosByUserId, getPhotosByUserId, updatePhotoByUserId };
