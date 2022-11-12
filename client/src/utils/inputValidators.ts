import dayjs from 'dayjs';

export const validateUsername = (username: string) => {
	if (username.length < 4) {
		return 'Too short (Length: 4-21 charachters)';
	}
	const usernameRegex = /^[a-zA-Z0-9_\-.]{4,21}$/;
	if (!usernameRegex.test(username)) {
		return 'Invalid username';
	}
	return undefined;
};

export const validatePassword = (password: string) => {
	if (password.length < 8) {
		return 'Too short (Length: 8-42 charachters)';
	}
	const passwordRegex =
		/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,42})/;
	if (!passwordRegex.test(password)) {
		return 'Password should be at least 8 charachters long, contain at least one uppercase and lowercase letter, number and symbol';
	}
	return undefined;
};

export const validateEmail = (email: string) => {
	const emailRegex =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if (!emailRegex.test(email)) {
		return 'Incorrect email format';
	}
	return undefined;
};

export const validateFirstame = (firstname: string) => {
	const nameRegex = /^[a-zA-Z'_\-.]{1,21}$/;
	if (!nameRegex.test(firstname)) {
		return 'Incorrect field';
	}
	return undefined;
};

export const validateLastname = (lastname: string) => {
	const nameRegex = /^[a-zA-Z'_\-.]{1,42}$/;
	if (!nameRegex.test(lastname)) {
		return 'Incorrect field';
	}
	return undefined;
};

export const validateBirthday = (birthday: any) => {
	console.log('dayjs ', dayjs(birthday));
	if (dayjs(birthday)) {
		let now = dayjs();
		console.log('now ', now);
		let diff = dayjs(birthday).diff(now, 'years');
		if (diff <= 18) {
			return (dayjs(birthday));
		}
	}
	return undefined;
};

export const validateBio = (bio: string) => {
	if (bio.length < 10 || bio.length > 255) {
		return 'This field should be 10-255 characters long.';
	}
	return undefined;
};

export const validateSignUpForm = (
	username: string,
	email: string,
	password: string,
	firstname: string,
	lastname: string
) => {
	return !validateUsername(username) &&
		!validateEmail(email) &&
		!validatePassword(password) &&
		!validateFirstame(firstname) &&
		!validateLastname(lastname)
		? true
		: false;
};

export const validateLoginForm = (username: string, password: string) => {
	return !validateUsername(username) && !validatePassword(password) ? true : false;
};

export const validateProfileForm = (
	username: string,
	email: string,
	firstname: string,
	lastname: string,
	bio: string
) => {
	return !validateUsername(username) &&
		!validateEmail(email) &&
		!validateFirstame(firstname) &&
		!validateLastname(lastname) &&
		!validateBio(bio)
		? true
		: false;
};
