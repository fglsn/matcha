import Navbar from './components/Navbar';
import Main from './components/Main';
import SignUpForm from './components/SignUpForm';
import LoginForm from './components/LoginForm';
import Footer from './components/Footer';

import AlertProvider from './components/AlertProvider';
import { AlertSnackBar } from './components/AlertSnackBar';

import { Routes, Route, Navigate } from 'react-router-dom';

import { Box } from '@mui/material';
import { useContext } from 'react';
import { StateContext } from './state';
import TestAuth from './components/TestAuth';
// import AuthRequired from './components/AuthRequired';

const App = () => {
	const [{ loggedUser }] = useContext(StateContext);

	console.log(loggedUser); //rm later

	return (
		<AlertProvider>
			<Box>
				<Navbar />
				<AlertSnackBar />
				<Routes>
					<Route path="/" element={<Main />} />
					<Route path="/login" element={<LoginForm />} />
					<Route path="/signup" element={<SignUpForm />} />
					<Route path="/testAuth" element={<TestAuth /> }/> 
					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
				<Footer />
			</Box>
		</AlertProvider>
	);
};

export default App;
