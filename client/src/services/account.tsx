import axios from 'axios';
import { apiBaseUrl } from '../constants';
import { LoggedUser, NewUserDataWithoutId } from '../types';
import { handleAxiosError } from '../utils/errors';
import getAuthHeader from './auth';

export const getAccountPage = async (loggedUser: LoggedUser) => {
		try {
			const config = {
				headers: { Authorization: getAuthHeader() }
			};
			const response = await axios.get(`${apiBaseUrl}/account/${loggedUser.id}`, config);
			return response.data;
		} catch (err) {
			handleAxiosError(err);
		}
};

export const updateAccountUserData = async (loggedUser: LoggedUser, newUserData: NewUserDataWithoutId) => {
	try {
		const config = {
			headers: { Authorization: getAuthHeader() }
		};
		const response = await axios.put(
			`${apiBaseUrl}/account/${loggedUser.id}`,
			newUserData,
			config
		);
		return response.data;
	} catch (err) {
		handleAxiosError(err);
	}
};

const moduleExports = { getAccountPage, updateAccountUserData };
export default moduleExports;
