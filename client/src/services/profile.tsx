import axios from 'axios';
import { apiBaseUrl } from '../constants';
import { Images, NewUserData } from '../types';
import { handleAxiosError } from '../utils/errors';
import getAuthHeader from './auth';

export const getPublicProfile = async (userId: string) => {
	try {
		const config = {
			headers: { Authorization: getAuthHeader() }
		};
		const response = await axios.get(`${apiBaseUrl}/users/${userId}/public_profile`, config);
		return response.data;
	} catch (err) {
		handleAxiosError(err);
	}
};

export const getProfile = async (userId: string) => {
	try {
		const config = {
			headers: { Authorization: getAuthHeader() }
		};
		const response = await axios.get(`${apiBaseUrl}/users/${userId}/profile`, config);
		return response.data;
	} catch (err) {
		handleAxiosError(err);
	}
};

export const updateProfile = async (userId: string, newUserData: NewUserData) => {
	try {
		const config = {
			headers: { Authorization: getAuthHeader() }
		};
		const response = await axios.put(
			`${apiBaseUrl}/users/${userId}/profile`,
			newUserData,
			config
		);
		return response.data;
	} catch (err) {
		handleAxiosError(err);
	}
};

export const getPhotos = async (userId: string) => {
	try {
		const config = {
			headers: { Authorization: getAuthHeader() }
		};
		const response = await axios.get(`${apiBaseUrl}/users/${userId}/photos`, config);
		return response.data;
	} catch (err) {
		handleAxiosError(err);
	}
};

export const getLike = async (userId: string) => {
	try {
		const config = {
			headers: { Authorization: getAuthHeader() }
		};
		const response = await axios.get(`${apiBaseUrl}/users/${userId}/public_profile/like`, config);
		return response.data;
	} catch (err) {
		handleAxiosError(err);
	}
};
export const likeProfile = async (userId: string) => {
	try {
		const config = {
			headers: { Authorization: getAuthHeader() }
		};
		const response = await axios.post(`${apiBaseUrl}/users/${userId}/public_profile/like`, undefined ,config);
		return response.data;
	} catch (err) {
		handleAxiosError(err);
	}
};
export const dislikeProfile = async (userId: string) => {
	try {
		const config = {
			headers: { Authorization: getAuthHeader() }
		};
		const response = await axios.delete(`${apiBaseUrl}/users/${userId}/public_profile/like`, config);
		return response.data;
	} catch (err) {
		handleAxiosError(err);
	}
};

export const checkProfileCompleteness = async (userId: string) => {
	try {
		const config = {
			headers: { Authorization: getAuthHeader() }
		};
		const response = await axios.get(
			`${apiBaseUrl}/users/${userId}/complete`,
			config
		);
		return response.data;
	} catch (err) {
		handleAxiosError(err);
	}
};

export const uploadPhotos = async (userId: string, images: Images) => {
	try {
		const config = {
			headers: { Authorization: getAuthHeader() }
		};
		await axios.post(`${apiBaseUrl}/users/${userId}/photos`, images, config);
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

export const requestLocation = async (coordinates: number[] | undefined) => {
	try {
		const config = {
			headers: { Authorization: getAuthHeader() }
		};
		let response;

		response = await axios.post<string>(
			`${apiBaseUrl}/location`,
			{ coordinates },
			config
		);

		return response.data;
	} catch (err) {
		handleAxiosError(err);
	}
};

const moduleExports = {
	getPublicProfile,
	getProfile,
	updateProfile,
	getPhotos,
	uploadPhotos,
	requestUpdateEmail,
	updateEmailbyToken,
	updatePassword,
	requestLocation
};

export default moduleExports;
