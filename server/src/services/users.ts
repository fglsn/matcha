import { NewUser, User } from '../types';
import { addNewUser } from '../repositories/userRepository';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

export const createNewUser = async (newUser: NewUser): Promise<User> => {
	const saltRounds = 10;
	const passwordHash = await bcrypt.hash(newUser.passwordPlain, saltRounds);
	const activationCode = crypto.randomBytes(20).toString('hex');

	return addNewUser({ ...newUser, passwordHash, activationCode });
};
