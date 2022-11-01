import { NewUser, User } from '../types';
import { addNewUser } from '../repositories/userRepository';
import bcrypt from 'bcrypt';

export const createNewUser = async (newUser: NewUser): Promise<User> => {
	const saltRounds = 10;
	const passwordHash = await bcrypt.hash(newUser.passwordPlain, saltRounds);
	return addNewUser({ ...newUser, passwordHash });
};
