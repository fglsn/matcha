import { NewUser, NewUserWithHashedPwd } from '../types';
import bcrypt from 'bcrypt';

export const createNewUser = async ({ username, email, passwordPlain, firstname, lastname }: NewUser): Promise<NewUserWithHashedPwd> => {
	const saltRounds = 10;
	const passwordHash = await bcrypt.hash(passwordPlain, saltRounds);
	//save to db, call method
	return { username, email, passwordHash, firstname, lastname };
};
