import axios from 'axios';
import getAuthHeader from './auth';
import { handleAxiosError } from '../utils/errors';
import { apiBaseUrl } from '../constants';

export const getChats = async (): Promise<any> => {
	try {
		const config = {
			headers: { Authorization: getAuthHeader() }
		};
		const response = await axios.get(`${apiBaseUrl}/users/chats`, config);
		return response.data;
	} catch (err) {
		handleAxiosError(err);
	}
};

export const getChatNotifications = async (): Promise<any> => {
	try {
		const config = {
			headers: { Authorization: getAuthHeader() }
		};
		const response = await axios.get(`${apiBaseUrl}/users/chat_notificatoins`, config);
		return response.data;
	} catch (err) {
		handleAxiosError(err);
	}
};