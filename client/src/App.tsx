import React, { useState } from 'react';

import SignUpForm from './components/SignUpForm';
import LoginForm from './components/LoginForm';
import Footer from './components/Footer';

import {
	Routes,
	Route,
	Link
	// Navigate,
} from 'react-router-dom';

import { Box, Button, AppBar, Toolbar, Typography } from '@mui/material';

import LoyaltyIcon from '@mui/icons-material/Loyalty';
import { Alert } from './components/Alert';

type NotificationContextValue = {
	notification: string | undefined;
	setNotification: (notification: string) => void;
};

export const NotificationContext =
	React.createContext<NotificationContextValue>({
		notification: undefined,
		setNotification: (_notificaiton) => {}
	});

const App = () => {
	const [notification, setNotification] = useState<string | undefined>(
		undefined
	);

	return (
		// extract to a component: https://dev.to/doylecodes/making-alerts-for-a-web-app-41d6
		<NotificationContext.Provider
			value={{
				notification,
				setNotification: (newNotification: string) => {
					setNotification(newNotification);
					setTimeout(() => {
						setNotification(undefined);
					}, 1000);
				}
			}}
		>
			<Box>
				<AppBar
					position="static"
					color="secondary"
					sx={{ justifyContent: 'space-between' }}
				>
					<Toolbar sx={{ justifyContent: 'flex-end' }}>
						<Typography
							color="primary"
							component={Link}
							to="/"
							sx={{
								flexGrow: 1,
								display: { xs: 'none', sm: 'block' }
							}}
						>
							<LoyaltyIcon
								sx={{
									flexGrow: 1,
									display: { xs: 'none', sm: 'block' }
								}}
							/>
						</Typography>
						<Button color="inherit" component={Link} to="/login">
							Login
						</Button>
						<Button color="inherit" component={Link} to="/signup">
							Sign Up
						</Button>
						{/* {user
							? <div>
								<em>{user.name} logged in </em>
								<Button onClick={handleLogout} color="inherit">Logout</Button>
							</div>
							: <Button color="inherit" component={Link} to="/login">
								login
							</Button>
						} */}
					</Toolbar>
				</AppBar>
				<Alert />
				<Routes>
					<Route path="/login" element={<LoginForm />} />
					<Route path="/signup" element={<SignUpForm />} />
				</Routes>
				<Footer />
			</Box>
		</NotificationContext.Provider>
	);
};

export default App;
