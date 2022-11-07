import axios from 'axios';
import { apiBaseUrl } from '../constants';

const getAuthHeader = () => {
	const loggedUser = localStorage.getItem('loggedUser');
	if (loggedUser) {
		const token = JSON.parse(loggedUser).token;
		return (`Bearer: ${token}`);
	}
	throw Error('No token in local storage');
};

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
