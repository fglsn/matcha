import jwt from 'jsonwebtoken';
import { User } from '../types';

export const createToken = (user: User): string | undefined => {
	if (process.env.SECRET) {
		return jwt.sign(
			{ id: user.id, username: user.username },
			process.env.SECRET, //change to be secret
			{ expiresIn: 60 * 60 }
		);
	}
	return undefined;
};