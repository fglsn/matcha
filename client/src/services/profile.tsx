import axios from 'axios';
import { apiBaseUrl } from '../constants';
import { LoggedUser, NewUserDataWithoutId } from '../types';
import { handleAxiosError } from '../utils/errors';
import getAuthHeader from './auth';

export const getProfile = async (loggedUser: LoggedUser) => {
	try {
		const config = {
			headers: { Authorization: getAuthHeader() }
		};
		const response = await axios.get(
			`${apiBaseUrl}/users/${loggedUser.id}/profile`,
			config
		);
		return response.data;
	} catch (err) {
		handleAxiosError(err);
	}
};

export const updateProfile = async (
	loggedUser: LoggedUser,
	newUserData: NewUserDataWithoutId
) => {
	try {
		const config = {
			headers: { Authorization: getAuthHeader() }
		};
		const response = await axios.put(
			`${apiBaseUrl}/users/${loggedUser.id}/profile`,
			newUserData,
			config
		);
		return response.data;
	} catch (err) {
		handleAxiosError(err);
	}
};

export const requestEmailUpdate = async ({ email }: { email: string }) => {
	try {
		const config = {
			headers: { Authorization: getAuthHeader() }
		};
		const response = await axios.post(
			`${apiBaseUrl}/users/update_email`,
			{email},
			config
		);
		return response.data;
	} catch (err) {
		handleAxiosError(err);
	}
};

export const checkUpdateTokenEmail = async (updateToken: string): Promise<void> => {
	await axios.get(`${apiBaseUrl}/users/update_email/${updateToken}`);
}
const moduleExports = {
	getProfile,
	updateProfile,
	requestEmailUpdate,
	checkUpdateTokenEmail
};
export default moduleExports;
