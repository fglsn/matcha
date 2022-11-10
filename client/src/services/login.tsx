import axios from 'axios';
import { apiBaseUrl } from '../constants';

// Login user & set data to local storage, server throws error on error
const login = async (credentials: { username: string; password: string }) => {
	const response = await axios.post(`${apiBaseUrl}/login`, credentials);
	localStorage.setItem('loggedUser', JSON.stringify(response.data));
	return response.data;
};

const moduleExports = { login };
export default moduleExports;
