import axios from 'axios';
import { apiBaseUrl } from '../constants';

const login = async (credentials: { username: string; password: string }) => {
	try {
		const response = await axios.post(`${apiBaseUrl}/login`, credentials);
		localStorage.setItem('loggedUser', JSON.stringify(response.data));
		return response.data;
	} catch (err) {
		return err.response.data;
	}
};

const moduleExports = { login };
export default moduleExports;
