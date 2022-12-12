import axios from 'axios';
import { apiBaseUrl } from '../constants';
// import { Images, NewUserData } from '../types';
import { handleAxiosError } from '../utils/errors';
import getAuthHeader from './auth';

export const getNotificationsQueue = async () => {
	try {
		const config = {
			headers: { Authorization: getAuthHeader() }
		};
		const response = await axios.get(
			`${apiBaseUrl}/users/notifications_queue`,
			config
		);
		return response.data;
	} catch (err) {
		handleAxiosError(err);
	}
};

export const getNotifications = async () => {
	try {
		const config = {
			headers: { Authorization: getAuthHeader() }
		};
		const response = await axios.get(
			`${apiBaseUrl}/users/notifications`,
			config
		);
		return response.data;
	} catch (err) {
		handleAxiosError(err);
	}
};