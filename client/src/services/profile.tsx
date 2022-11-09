import axios from 'axios';
import { apiBaseUrl } from '../constants';
import getAuthHeader from './auth';

export const getProfilePage = async () => {
	try {
		const config = {
			headers: { Authorization: getAuthHeader() }
		};
		const response = await axios.get(`${apiBaseUrl}/profile`, config);
		return response.data;
	} catch (err) {
		console.log(err);
		return;
	}
};

const moduleExports = { getProfilePage };
export default moduleExports;
