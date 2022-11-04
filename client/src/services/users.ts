import axios from 'axios';
import { apiBaseUrl } from '../constants';
import { NewUser } from '../types';

const create = async (newObject: NewUser): Promise<any> => {
	try {
		const response = await axios.post(`${apiBaseUrl}/users`, newObject);
		return response.data;
	} catch (err) {
		return err.response.data;
	}
};

const moduleExports = { create };
export default moduleExports;
