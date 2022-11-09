const getAuthHeader = () => {
	const loggedUser = localStorage.getItem('loggedUser');
	if (loggedUser) {
		const token = JSON.parse(loggedUser).token;
		return (`Bearer ${token}`);
	}
	throw Error('No token in local storage');
};

export default getAuthHeader;