import styled from '@emotion/styled';

import Navbar from './components/Navbar';
import Main from './components/Main';
import SignUpForm from './components/SignUpForm';
import LoginForm from './components/LoginForm';
import ForgotPassword from './components/ForgotPassword/index';
import ProfileEditor from './components/ProfileEditor/index';
import AlertProvider from './components/AlertProvider';
import AlertSnackBar from './components/AlertSnackBar';
import Footer from './components/Footer';

import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { useContext } from 'react';
import { StateContext } from './state';
import TestAuth from './components/TestAuth';
//import AuthRequired from './components/AuthRequired';

import { ErrorBoundary } from 'react-error-boundary';
import { SnackbarProvider } from 'notistack';
import UpdateEmail from './components/UpdateEmail';

const MinWidthContainer = styled.div`
	min-width: fit-content;
`;

//prettier-ignore
function ErrorFallback({ error, resetErrorBoundary }: { error: any, resetErrorBoundary: any }) {
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
			<MinWidthContainer>
				<SnackbarProvider>
					<AlertProvider>
						<Box>
							<Navbar />
							<AlertSnackBar />
							<Routes>
								<Route path="/" element={<Main />} />
								{/* prettier-ignore */}
								<Route path="/login" element={!loggedUser ? <LoginForm /> : <Navigate to="/"/>} />
								{/* prettier-ignore */}
								<Route path="/signup" element={!loggedUser ? <SignUpForm /> : <Navigate to="/"/>} />
								{/* prettier-ignore */}
								<Route path="/forgot_password" element={!loggedUser ? <ForgotPassword /> : <Navigate to="/"/>} />
								<Route path="/profile" element={<ProfileEditor />} />
								<Route path="/update_email" element={<UpdateEmail />} />
								<Route path="/testAuth" element={<TestAuth />} />
								<Route path="*" element={<Navigate to="/" replace />} />
							</Routes>
							<Footer />
						</Box>
					</AlertProvider>
				</SnackbarProvider>
			</MinWidthContainer>
		</ErrorBoundary>
	);
};

export default App;
