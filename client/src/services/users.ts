import axios from 'axios';
import { apiBaseUrl } from '../constants';
import { NewUser } from '../types';

// Create new user or throw
const create = async (newObject: NewUser): Promise<any> => {
	const response = await axios.post(`${apiBaseUrl}/users`, newObject);
	return response.data;
};

// Activate new user or throw
const activate = async (activationCode: string): Promise<void> => {
	await axios.post(`${apiBaseUrl}/users/activate/${activationCode}`);
};

// Validate request and send reset link by email or throw
const requestPasswordReset = async (email: string): Promise<void> => {
	await axios.post(`${apiBaseUrl}/users/forgot_password`, { email: email });
};

// Validate reset link on get request or throw
const checkResetToken = async (resetToken: string): Promise<void> => {
	await axios.get(`${apiBaseUrl}/users/forgot_password/${resetToken}`);
};

// Update users password or throw
const resetPassword = async (token: string, passwordPlain: string): Promise<void> => {
	await axios.post(`${apiBaseUrl}/users/forgot_password/${token}`, {
		password: passwordPlain
	});
};

// Get data for profile or throw
const getUserData = async (userId: string): Promise<any> => {
	const response = await axios.get(`${apiBaseUrl}/users/${userId}`);
	return response.data;
};

const moduleExports = {
	create,
	activate,
	requestPasswordReset,
	checkResetToken,
	resetPassword,
	getUserData
};

export default moduleExports;
