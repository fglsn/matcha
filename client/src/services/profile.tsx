import axios from 'axios';
import { apiBaseUrl } from '../constants';
import { LoggedUser } from '../types';
import { handleAxiosError } from '../utils/errors';
import getAuthHeader from './auth';

// export const getProfilePage = async () => {
// 	try {
// 		const config = {
// 			headers: { Authorization: getAuthHeader() }
// 		};
// 		const response = await axios.get(`${apiBaseUrl}/profile`, config);
// 		return response.data;
// 	} catch (err) {
// 		handleAxiosError(err);
// 	}
// };

export const getProfilePage = async (loggedUser: LoggedUser | undefined) => {
	if (loggedUser && loggedUser.id) {
		console.log(loggedUser.id);
		try {
			const config = {
				headers: { Authorization: getAuthHeader() }
			};
			const response = await axios.get(`${apiBaseUrl}/profile/${loggedUser.id}`, config);
			return response.data;
		} catch (err) {
			handleAxiosError(err);
		}
	}
};

const moduleExports = { getProfilePage };
export default moduleExports;
