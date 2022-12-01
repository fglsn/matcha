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
	const nameRegex = /^[a-zA-Z'\-ÄÖäöÅåßÜü\s]{1,21}$/;
	if (!nameRegex.test(firstname)) {
		return 'Incorrect field';
	}
	return undefined;
};

export const validateLastname = (lastname: string) => {
	const nameRegex = /^[a-zA-Z'\-ÄÖäöÅåßÜü\s]{1,42}$/;
	if (!nameRegex.test(lastname)) {
		return 'Incorrect field';
	}
	return undefined;
};

export const validateBirthday = (date: dayjs.Dayjs) => {
	let eighteenYearsAgo = dayjs().subtract(18, 'year');
	if (
		!dayjs.isDayjs(date) ||
		!dayjs(date).isValid() ||
		!dayjs(date).isBefore(eighteenYearsAgo) ||
		!dayjs(date).isAfter(dayjs('01/01/1900'))
	) {
		console.log('Incorrect field, user should be at least 18yo'); //rm later
		return 'Incorrect field, user should be at least 18yo';
	}
	return undefined;
};

export const validateBio = (bio: string) => {
	let trimmedBio = bio.trim().replace(/\s\s+/g, ' ');
	if (trimmedBio.length < 10 || trimmedBio.length > 255) {
		return 'This field should be 10-255 characters long. (Note that we are removing recurring spaces)';
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

export const validateProfileEditorForm = (
	firstname: string,
	lastname: string,
	date: dayjs.Dayjs,
	bio: string
) => {
	return !validateFirstame(firstname) &&
		!validateLastname(lastname) &&
		!validateBirthday(date) &&
		!validateBio(bio)
		? true
		: false;
};

export const validateUpdatePasswordForm = (oldPassword: string, newPassword: string) => {
	return !validatePassword(oldPassword) && !validatePassword(newPassword)
		? true
		: false;
};
