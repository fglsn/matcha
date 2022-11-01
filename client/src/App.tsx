import Navbar from './components/Navbar'
import SignUpForm from './components/SignUpForm';
import LoginForm from './components/LoginForm';
import Footer from './components/Footer';

import AlertProvider from './components/AlertProvider';
import { Alert } from './components/Alert';

import { Routes, Route } from 'react-router-dom';

import { Box } from '@mui/material';

const App = () => {

	return (
		<AlertProvider>
			<Box>
				<Navbar />
				<Alert />
				<Routes>
					<Route path="/login" element={<LoginForm />} />
					<Route path="/signup" element={<SignUpForm />} />
				</Routes>
				<Footer />
			</Box>
		</AlertProvider>
	);
};

export default App;
