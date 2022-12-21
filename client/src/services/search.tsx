import axios from 'axios';
import getAuthHeader from './auth';
import { handleAxiosError } from '../utils/errors';
import { apiBaseUrl } from '../constants';

export const getMatchSuggestions = async (): Promise<any> => {
	try {
		const config = {
			headers: { Authorization: getAuthHeader() }
		};
		const response = await axios.get(
			`${apiBaseUrl}/users/match_suggestions`,
			config
		);
		return response.data;
	} catch (err) {
		handleAxiosError(err);
	}
};
