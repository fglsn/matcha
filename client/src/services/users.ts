import axios from 'axios';
import { apiBaseUrl } from '../constants';
import { NewUser } from '../types';

const create = async (newObject: NewUser): Promise<any> => {
	try {
		const response = await axios.post(`${apiBaseUrl}/users`, newObject);
		return response.data;
	} catch (err) {
		return err.response.data;
	}
};

const activate = async (activationCode: string): Promise<void> => {
	await axios.get(`${apiBaseUrl}/users/activate/${activationCode}`);
};

const requestPasswordReset = async (email: string): Promise<void> => {
	try {
		await axios.post(`${apiBaseUrl}/users/forgot_password`, {email: email});
	} catch (err) {
		return err;
	}
}

const checkResetToken = async (resetToken: string): Promise<void> => {
	await axios.get(`${apiBaseUrl}/users/forgot_password/${resetToken}`);
}

const moduleExports = { create, activate, requestPasswordReset, checkResetToken };
export default moduleExports;
