// import { useEffect } from "react";
// import { setLoggedUser, useStateValue } from "../state";

import { Container } from "@mui/material";
import withProfileRequired from "./ProfileRequired";

const Main = () => {
	// const [, dispatch] = useStateValue();

	// useEffect(() => {
	// 	const fetchLoggedUser = () => {
	// 		const loggedUserJSON = window.localStorage.getItem('loggedUser')
	// 		if (loggedUserJSON) {
	// 			const user = JSON.parse(loggedUserJSON)
	// 			dispatch(setLoggedUser(user));
	// 		};
	// 	}
	// 	void fetchLoggedUser();
	// }, [dispatch])

	return <Container sx={{ mt: 15, mb: 8 }}>HELLO</Container>;
};

export default withProfileRequired(Main);