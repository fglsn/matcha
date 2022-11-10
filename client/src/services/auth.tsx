import { AuthError } from "../utils/errors";

const getAuthHeader = () => {
	const loggedUser = localStorage.getItem('loggedUser');
	if (loggedUser) {
		const token = JSON.parse(loggedUser).token;
		return (`Bearer ${token}`);
	}
	throw new AuthError('No session found. Please login again.');
};

export default getAuthHeader;