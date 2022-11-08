import bcrypt from 'bcrypt';
import crypto from 'crypto';

import { NewUser, PasswordResetRequest, User } from '../types';
import { sendMail } from '../utils/mailer';
import { addNewUser, findUserByActivationCode, setUserAsActive, findUserByEmail } from '../repositories/userRepository';
import { AppError } from '../errors';
import { addPasswordResetRequest, findPasswordResetRequestByUserId, removePasswordResetRequest } from '../repositories/passwordResetRequestRepository';

//create
export const createNewUser = async (newUser: NewUser): Promise<User> => {
	const saltRounds = 10;
	const passwordHash = await bcrypt.hash(newUser.passwordPlain, saltRounds);
	const activationCode = crypto.randomBytes(20).toString('hex');
	return addNewUser({ ...newUser, passwordHash, activationCode });
};

//activate
export const sendActivationCode = (user: User): void => {
	sendMail(
		user.email,
		'Activation code for Matcha-account',
		`<h1>Hi and thanks for signing up!</h1>
			<p>Please visit the link to activate your account here:</p>
			<a href='http://localhost:3000/login?activate=${user.activationCode}'>Link</a>
			<p> See you at Matcha! <3 </p>`
	);
};

export const activateAccount = async (activationCode: string): Promise<void> => {
	const user = await findUserByActivationCode(activationCode);
	if (!user) {
		throw new AppError("Activation code doesn't exist", 400);
	}
	if (user.isActive) {
		throw new AppError('Account already activated', 400);
	}
	if (!user.isActive) {
		await setUserAsActive(activationCode);
	}
};

//reset pwd
export const sendResetLink = async (email: string): Promise<void> => {
	const user = await findUserByEmail(email);
	if (!user) {
		throw new AppError("Couldn't find this email address.", 400);
	}

	const resetRequset = await findPasswordResetRequestByUserId(user.id);
	if (resetRequset) {
		await removePasswordResetRequest(resetRequset.token);
	}

	const newResetRequset = await addPasswordResetRequest(user.id);
	if (!newResetRequset) {
		throw new AppError('Error creating reset link, please try again', 400);
	}
	sendResetPasswordLink(user, newResetRequset);
};

export const sendResetPasswordLink = (user: User, newResetRequset: PasswordResetRequest): void => {
	sendMail(
		user.email,
		'Password reset link for Matcha-account',
		`<h1>Hi, forgot your password? No problem! !</h1>
			<p>Visit the link below to reset your password:</p>
			<a href='http://localhost:3000/forgot_password?reset=${newResetRequset.token}'>Reset password here</a>
			<p>Link will be active until ${newResetRequset.expiresAt}.</p>
			<p>Ignore this message if you haven't requested password reset.</p>

			<p> See you at Matcha! <3 </p>`
	);
};