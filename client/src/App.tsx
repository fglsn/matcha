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
//import AuthRequired from './components/AuthRequired';

import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }: {error: any, resetErrorBoundary: any}) {
	return (
		<div role="alert">
			<p>Something went wrong:</p>
			<pre>{error.message}</pre>
			<button onClick={resetErrorBoundary}>Try again</button>
		</div>
	);
}

const App = () => {
	const [{ loggedUser }] = useContext(StateContext);

	console.log(loggedUser); //rm later

	return (
		<ErrorBoundary
			FallbackComponent={ErrorFallback}
			onReset={() => {
				// reset the state of your app so the error doesn't happen again
			}}
		>
			<AlertProvider>
				<Box>
					<Navbar />
					<AlertSnackBar />
					<Routes>
						<Route path="/" element={<Main />} />
						<Route path="/login" element={<LoginForm />} />
						<Route path="/signup" element={<SignUpForm />} />
						<Route path="/testAuth" element={<TestAuth />} />
						<Route path="*" element={<Navigate to="/" replace />} />
					</Routes>
					<Footer />
				</Box>
			</AlertProvider>
		</ErrorBoundary>
	);
};

export default App;
