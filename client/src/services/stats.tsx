import axios from 'axios';
import getAuthHeader from './auth';
import { handleAxiosError } from '../utils/errors';
import { apiBaseUrl } from '../constants';

export const getVisitHistory = async (userId: string): Promise<any> => {
	try {
		const config = {
			headers: { Authorization: getAuthHeader() }
		};
		const response = await axios.get(
			`${apiBaseUrl}/users/${userId}/visit_history`,
			config
		);
		return response.data;
	} catch (err) {
		handleAxiosError(err);
	}
};

export const getLikes = async (userId: string): Promise<any> => {
	try {
		const config = {
			headers: { Authorization: getAuthHeader() }
		};
		const response = await axios.get(`${apiBaseUrl}/users/${userId}/likes`, config);
		return response.data;
	} catch (err) {
		handleAxiosError(err);
	}
};

export const getUserEntries = async (idList: string[]): Promise<any> => {
	try {
		const config = {
			headers: { Authorization: getAuthHeader() }
		};
		const response = await axios.post(`${apiBaseUrl}/users/entries`, idList, config);
		return response.data;
	} catch (err) {
		handleAxiosError(err);
	}
};

// const moduleExports = {
// 	getVisitHistory
// };

// export moduleExports;
