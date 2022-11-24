import axios from 'axios';
import { apiBaseUrl } from '../constants';
import { Images, LoggedUser, NewUserDataWithoutId } from '../types';
import { handleAxiosError } from '../utils/errors';
import getAuthHeader from './auth';

export const getProfile = async (loggedUser: LoggedUser) => {
	try {
		const config = {
			headers: { Authorization: getAuthHeader() }
		};
		const responseProfile = await axios.get(
			`${apiBaseUrl}/users/${loggedUser.id}/profile`,
			config
		);
		console.log(responseProfile.data);
		
		const responsePhotos = await axios.get(
			`${apiBaseUrl}/users/${loggedUser.id}/photos`,
			config
		);
		console.log(responsePhotos.data);
		return {...responseProfile.data, ...responsePhotos.data } ;
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
export const uploadPhotos = async (
	loggedUser: LoggedUser,
	images: Images
) => {
	try {
		const config = {
			headers: { Authorization: getAuthHeader() }
		};
		await axios.post(
			`${apiBaseUrl}/users/${loggedUser.id}/photos`,
			images,
			config
		);
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
	uploadPhotos
	// requestLocation
};

export default moduleExports;
