export const validateUsername = (username: string) => {
	const usernameRegex = /^[a-zA-Z0-9_\-.]*{4,}$/;
	return usernameRegex.test(username);
};

export const validatePassword = (password: string) => {
	const passwordRegex =
		/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
	return passwordRegex.test(password);
};

export const validateEmail = (email: string) => {
	const emailRegex =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return emailRegex.test(email);
};

export const validateName = (name: string) => {
	const nameRegex = /^[a-zA-Z'_\-.]*$/;
	return nameRegex.test(name);
};

export const validateSignUpForm = (
	username: string,
	email: string,
	password: string,
	firstname: string,
	lastname: string
) => {
	return validateUsername(username) &&
		validateEmail(email) &&
		validatePassword(password) &&
		validateName(firstname) &&
		validateName(lastname)
		? true
		: false;
};
