import axios from 'axios';
import { apiBaseUrl } from '../constants';

const login = async (credentials: { username: string, password: string }) => {
	const response = await axios.post(`${apiBaseUrl}/login`, credentials);
	return response.data;
}

const moduleExports = { login };
export default moduleExports;