import bcrypt from 'bcrypt';
import crypto from 'crypto';

import { EmailResetRequest, NewUser, PasswordResetRequest, User } from '../types';
import { sendMail } from '../utils/mailer';
import { addNewUser, findUserByActivationCode, setUserAsActive, findUserByEmail, updateUserPassword, updateUserEmail } from '../repositories/userRepository';
import { AppError } from '../errors';
import {
	addPasswordResetRequest,
	findPasswordResetRequestByUserId,
	removePasswordResetRequest,
	removePasswordResetRequestByUserId
} from '../repositories/passwordResetRequestRepository';
import {
	addEmailResetRequest,
	findEmailResetRequestByUserId,
	removeEmailResetRequest,
	removeEmailResetRequestByUserId
} from '../repositories/emailResetRequestRepository';
import { updateSessionEmailByUserId } from '../repositories/sessionRepository';

//create
export const createHashedPassword = async (passwordPlain: string): Promise<string> => {
	const saltRounds = 10;
	return await bcrypt.hash(passwordPlain, saltRounds);
};

export const createNewUser = async (newUser: NewUser): Promise<User> => {
	const passwordHash = await createHashedPassword(newUser.passwordPlain);
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

	if (!user.isActive) {
		throw new AppError('Account is not active, please activate account first.', 400);
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

export const sendEmailResetLink = async (id: string, email: string): Promise<void> => {
	const resetRequset = await findEmailResetRequestByUserId(id);
	if (resetRequset) {
		await removeEmailResetRequest(resetRequset.token);
	}

	const newResetRequset = await addEmailResetRequest(id, email);
	if (!newResetRequset) {
		throw new AppError('Error creating reset link, please try again', 400);
	}
	sendResetEmailLink(email, newResetRequset);
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

export const sendResetEmailLink = (email: User['email'], newResetRequset: EmailResetRequest): void => {
	sendMail(
		email,
		'Confirm email reset for Matcha-account',
		`<h1>Hi, here you can confirm email reset!</h1>
			<p>Visit the link below to reset your email:</p>
			<a href='http://localhost:3000/email_reset?reset=${newResetRequset.token}'>Reset email here</a>
			<p>Link will be active until ${newResetRequset.expiresAt}.</p>
			<p>Ignore this message if you haven't requested email reset.</p>

			<p> See you at Matcha! <3 </p>`
	);
};

export const changeForgottenPassword = async (userId: string, passwordPlain: string): Promise<void> => {
	const passwordHash = await createHashedPassword(passwordPlain);
	await updateUserPassword(userId, passwordHash);
	await removePasswordResetRequestByUserId(userId);
};

export const updatePassword = async (userId: string, passwordPlain: string): Promise<void> => {
	const passwordHash = await createHashedPassword(passwordPlain);
	await updateUserPassword(userId, passwordHash);
};

export const changeUserEmail = async (emailResetRequest: EmailResetRequest): Promise<void> => {
	await updateUserEmail(emailResetRequest.userId, emailResetRequest.email);
	await removeEmailResetRequestByUserId(emailResetRequest.userId);
	await updateSessionEmailByUserId(emailResetRequest.userId, emailResetRequest.email);
};
