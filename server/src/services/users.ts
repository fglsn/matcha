import bcrypt from 'bcrypt';
import crypto from 'crypto';

import { NewUser, User } from '../types';
import { sendMail } from '../utils/mailer';
import { addNewUser, findUserByActivationCode, setUserAsActive } from '../repositories/userRepository';
import { AppError } from '../errors';

export const createNewUser = async (newUser: NewUser): Promise<User> => {
	const saltRounds = 10;
	const passwordHash = await bcrypt.hash(newUser.passwordPlain, saltRounds);
	const activationCode = crypto.randomBytes(20).toString('hex');
	return addNewUser({ ...newUser, passwordHash, activationCode });
};

export const sendActivationCode = (user: User): void => {
	sendMail(
		user.email,
		'Activation code for Matcha-account',
		`<h1>Hi and thanks for signing up!</h1>
			<p>Please visit the link to activate your account here:</p>
			<a href='http://localhost:3001/users/activate/${user.activationCode}'>Link</a>
			<p> See you at Matcha! <3 </p>`
	);
};

export const activateAccount = async (activationCode: string): Promise<void> => {
	const user = await findUserByActivationCode(activationCode);
	if (!user) {
		throw new AppError('Activation code doesn\'t exist', 400);
	}
	console.log(user);
	if (!user.isActive) {
		await setUserAsActive(activationCode);
	}
	if (user.isActive) {
		throw new AppError('Account already activated', 400);
	}
};