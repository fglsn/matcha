import { useEffect } from "react";
import { setLoggedUser, useStateValue } from "../state";

const Main = () => {
	const [, dispatch] = useStateValue();

	useEffect(() => {
		const fetchLoggedUser = () => {
			const loggedUserJSON = window.localStorage.getItem('loggedUser')
			if (loggedUserJSON) {
				const user = JSON.parse(loggedUserJSON)
				dispatch(setLoggedUser(user));
			};
		}
		void fetchLoggedUser();
	}, [dispatch])

	return <>HELLO</>;
};

export default Main;