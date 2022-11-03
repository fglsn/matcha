import jwt from 'jsonwebtoken';
import { User } from '../types';

export const createToken = (user: User): string => {
	if (process.env.SECRET) {
		return jwt.sign({ id: user.id, username: user.username }, process.env.SECRET, { expiresIn: 60 * 60 });
	}
	throw Error('Set up SECRET env var!');
};
