/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NewUser } from '../types';
import { isString } from './basicTypeValidators';
import { ValidationError } from '../errors';

const usernameRegex = /^[a-zA-Z0-9_\-.]{4,21}$/;
const emailRegex =
	/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,42})/;
const nameRegex = /^[a-zA-Z'_\-.]*$/;
// eslint-disable-next-line no-useless-escape
const tokenRegex = /[a-z0-9\-]{36}/;

export const parseUsername = (username: unknown): string => {
	if (!username || !isString(username)) {
		throw new ValidationError(`Missing username / Expected username to be string, got: ${typeof username}`);
	}
	const trimmedUsername = username.trim();
	if (!trimmedUsername) {
		throw new ValidationError('Missing username');
	}
	if (trimmedUsername.length < 4) {
		throw new ValidationError('Username is too short');
	}
	if (trimmedUsername.length > 21) {
		throw new ValidationError('Username is too long');
	}
	if (!usernameRegex.test(trimmedUsername)) {
		throw new ValidationError('Invalid username');
	}
	return trimmedUsername;
};

export const parseEmail = (email: unknown): string => {
	if (!email || !isString(email)) {
		throw new ValidationError(`Missing email / Expected email to be string, got: ${typeof email}`);
	}
	const trimmedEmail = email.toLowerCase().trim();
	if (!trimmedEmail) {
		throw new ValidationError('Missing email');
	}
	if (!emailRegex.test(trimmedEmail)) {
		throw new ValidationError('Invalid email');
	}
	return trimmedEmail;
};

export const validatePassword = (passwordPlain: unknown): string => {
	if (!passwordPlain || !isString(passwordPlain)) {
		throw new ValidationError(`Missing password / Expected password to be string, got: ${typeof passwordPlain}`);
	}
	if (passwordPlain.length < 8) {
		throw new ValidationError('Password is too short');
	}
	if (passwordPlain.length > 42) {
		throw new ValidationError('Password is too long');
	}
	if (!passwordRegex.test(passwordPlain)) {
		throw new ValidationError('Weak password');
	}
	return passwordPlain;
};

export const parseFirstname = (firstname: unknown): string => {
	if (!firstname || !isString(firstname)) {
		throw new ValidationError(`Missing first name / Expected firstname to be string, got: ${typeof firstname}`);
	}
	const trimmedFirstname = firstname.trim();
	if (!trimmedFirstname) {
		throw new ValidationError('Missing firstname');
	}
	if (trimmedFirstname.length > 21) {
		throw new ValidationError('First name is too long');
	}
	if (!nameRegex.test(trimmedFirstname)) {
		throw new ValidationError('Invalid firstname');
	}
	return trimmedFirstname;
};

export const parseLastname = (lastname: unknown): string => {
	if (!lastname || !isString(lastname)) {
		throw new ValidationError(`Missing last name / Expected lastname to be string, got: ${typeof lastname}`);
	}
	const trimmedLastname = lastname.trim();
	if (!trimmedLastname) {
		throw new ValidationError('Missing lastname');
	}
	if (trimmedLastname.length > 41) {
		throw new ValidationError('Lastname is too long');
	}
	if (!nameRegex.test(trimmedLastname)) {
		throw new ValidationError('Invalid lastname');
	}
	return trimmedLastname;
};

export const validateToken = (token: unknown): string => {
	if (!token || !isString(token)) {
		throw new ValidationError(`Missing token or not string: ${typeof token}`);
	}
	const trimmedToken = token.trim();
	if (!trimmedToken) {
		throw new ValidationError('Missing token');
	}
	if (trimmedToken.length !== 36) {
		throw new ValidationError('Invalid password reset code');
	}
	if (!tokenRegex.test(trimmedToken)) {
		throw new ValidationError('Invalid password reset code format');
	}
	return trimmedToken;
};

type Fields = { username: unknown; email: unknown; passwordPlain: unknown; firstname: unknown; lastname: unknown };

export const parseNewUserPayload = ({ username, email, passwordPlain, firstname, lastname }: Fields): NewUser => {
	const newUser: NewUser = {
		username: parseUsername(username),
		email: parseEmail(email),
		passwordPlain: validatePassword(passwordPlain),
		firstname: parseFirstname(firstname),
		lastname: parseLastname(lastname)
	};
	return newUser;
};
