/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NewUser } from '../types';
import { isString } from './basicTypeValidators';

const usernameRegex = /^[a-zA-Z0-9_-.]*$/;
const emailRegex =
	/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
const nameRegex = /^[a-zA-Z'_-.]*$/;

export const parseUsername = (username: unknown): string => {
	if (!username || !isString(username)) {
		throw new Error(`Missing username / Expected username to be string, got: ${typeof username}`);
	}
	const trimmedUsername = username.trim();
	if (!trimmedUsername) {
		throw new Error('Missing username');
	}
	if (trimmedUsername.length < 4) {
		throw new Error('Username is too short');
	}
	if (trimmedUsername.length > 21) {
		throw new Error('Username is too long');
	}
	if (!usernameRegex.test(trimmedUsername)) {
		throw new Error('Invalid username');
	}
	return trimmedUsername;
};

export const parseEmail = (email: unknown): string => {
	if (!email || !isString(email)) {
		throw new Error(`Missing email / Expected email to be string, got: ${typeof email}`);
	}
	const trimmedEmail = email.trim();
	if (!trimmedEmail) {
		throw new Error('Missing email');
	}
	if (!emailRegex.test(trimmedEmail)) {
		throw new Error('Invalid email');
	}
	return trimmedEmail;
};

export const validatePassword = (passwordPlain: unknown): string => {
	if (!passwordPlain || !isString(passwordPlain)) {
		throw new Error(`Missing password / Expected password to be string, got: ${typeof passwordPlain}`);
	}
	if (passwordPlain.length < 8) {
		throw new Error('Password is too short');
	}
	if (passwordPlain.length > 41) {
		throw new Error('Password is too long');
	}
	if (!passwordRegex.test(passwordPlain)) {
		throw new Error('Weak password');
	}
	return passwordPlain;
};

export const parseFirstname = (firstname: unknown): string => {
	if (!firstname || !isString(firstname)) {
		throw new Error(`Missing first name / Expected firstname to be string, got: ${typeof firstname}`);
	}
	const trimmedFirstname = firstname.trim();
	if (!trimmedFirstname) {
		throw new Error('Missing firstname');
	}
	if (trimmedFirstname.length > 23) {
		throw new Error('First name is too long');
	}
	if (!nameRegex.test(trimmedFirstname)) {
		throw new Error('Invalid firstname');
	}
	return trimmedFirstname;
};

export const parseLastname = (lastname: unknown): string => {
	if (!lastname || !isString(lastname)) {
		throw new Error(`Missing last name / Expected lastname to be string, got: ${typeof lastname}`);
	}
	const trimmedLastname = lastname.trim();
	if (!trimmedLastname) {
		throw new Error('Missing lastname');
	}
	if (trimmedLastname.length > 41) {
		throw new Error('Last name is too long');
	}
	if (!nameRegex.test(trimmedLastname)) {
		throw new Error('Invalid lastname');
	}
	return trimmedLastname;
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