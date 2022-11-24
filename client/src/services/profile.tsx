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

export const requestUpdateEmail = async ({
	id,
	email
}: {
	id: string;
	email: string;
}) => {
	try {
		const config = {
			headers: { Authorization: getAuthHeader() }
		};
		const response = await axios.post(
			`${apiBaseUrl}/users/${id}/update_email`,
			{ email },
			config
		);
		return response.data;
	} catch (err) {
		handleAxiosError(err);
	}
};

export const updateEmailbyToken = async (updateToken: string): Promise<void> => {
	await axios.put(`${apiBaseUrl}/users/update_email/${updateToken}`);
};

export const updatePassword = async ({
	id,
	oldPassword,
	password
}: {
	id: string;
	oldPassword: string;
	password: string;
}): Promise<void> => {
	try {
		const config = {
			headers: { Authorization: getAuthHeader() }
		};
		await axios.put(
			`${apiBaseUrl}/users/${id}/password/`,
			{ oldPassword, password },
			config
		);
	} catch (err) {
		handleAxiosError(err);
	}
};

// export const requestLocation = async (id: string, coordinates: number[] | undefined) => {
// 	try {
// 		const config = {
// 			headers: { Authorization: getAuthHeader() }
// 		};
// 		let response;

// 		response = await axios.put(
// 			`${apiBaseUrl}/users/${id}/location`,
// 			{ coordinates },
// 			config
// 		);

// 		return response.data;
// 	} catch (err) {
// 		handleAxiosError(err);
// 	}
// };

const moduleExports = {
	getProfile,
	updateProfile,
	requestUpdateEmail,
	updateEmailbyToken,
	updatePassword,
	// requestLocation
};

export default moduleExports;
