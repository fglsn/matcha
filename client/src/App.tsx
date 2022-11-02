import Navbar from './components/Navbar';
import Main from './components/Main';
import SignUpForm from './components/SignUpForm';
import LoginForm from './components/LoginForm';
import Footer from './components/Footer';

import AlertProvider from './components/AlertProvider';
import { AlertSnackBar } from './components/AlertSnackBar';

import { Routes, Route } from 'react-router-dom';

import { Box } from '@mui/material';
import { useContext, useEffect } from 'react';
import { setLoggedUser, StateContext, useStateValue } from './state';

const App = () => {
	const [, dispatch] = useStateValue();
	const loggedUser = useContext(StateContext);

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

	console.log(loggedUser[0].loggedUser);

	return (
		<AlertProvider>
			<Box>
				<Navbar/>
				<AlertSnackBar />
				<Routes>
					<Route path="/" element={<Main/>} />
					<Route path="/login" element={<LoginForm />} />
					<Route path="/signup" element={<SignUpForm />} />
				</Routes>
				<Footer />
			</Box>
		</AlertProvider>
	);
};

export default App;
