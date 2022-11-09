import axios from 'axios';
import { apiBaseUrl } from '../constants';
import getAuthHeader from './auth';

export const testGetProtectedPage = async () => {
	try {
		const config = {
			headers: { Authorization: getAuthHeader() }
		};
		const response = await axios.get(`${apiBaseUrl}/testAuth`, config);
		return response.data;
	} catch (err) {
		console.log(err);
		return;
	}
};

const moduleExports = { testGetProtectedPage };
export default moduleExports;
