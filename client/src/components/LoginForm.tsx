import { useContext, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import {
	Avatar,
	Box,
	Button,
	CssBaseline,
	TextField,
	Checkbox,
	Grid,
	FormControlLabel,
	Container,
	Link,
	Typography
} from '@mui/material';

import userService from '../services/users';
import loginService from '../services/login';
import { useField } from '../hooks/useField';
import { AlertContext } from './AlertProvider';
import { setLoggedUser, StateContext } from '../state';
import {
	validatePassword,
	validateUsername,
	validateLoginForm
} from '../utils/inputValidators';

const LoginForm = () => {
	const username = useField('text', 'Username', validateUsername);
	const password = useField('text', 'Password', validatePassword);

	const [showPassword, setShow] = useState(false);

	const navigate = useNavigate();

	const [, dispatch] = useContext(StateContext);

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [searchParams, setSearchParams] = useSearchParams();
	const activationCode = searchParams.get('activate');
	const alert = useContext(AlertContext);

	useEffect(() => {
		const activateAccount = async () => {
			if (activationCode) {
				try {
					await userService.activate(activationCode);
					navigate('/login');
					alert.success('Account activated successfully!');
				} catch (err) {
					console.log(
						'Error in activate account (useEffect form) ' + err
					); //rm later
					alert.error(err.response?.data?.error);
					navigate('/login');
				}
			}
		};
		activateAccount();
	}, [activationCode, alert, navigate]);

	const handleLogin = async (event: any) => {
		event.preventDefault();

		const userToLogin = {
			username: username.value,
			password: password.value
		};

		try {
			const loggedInUser = await loginService.login(userToLogin);
			console.log(`User ${loggedInUser.username} logged in.`); //rm later
			alert.success(`Logged in successfuly. Welcome!`);
			dispatch(setLoggedUser(loggedInUser));
			navigate('/');
		} catch (err) {
			console.log('Error in handle login (login form) ' + err); //rm later
			if (err.response.data && err.response.data.error)
				alert.error(err.response.data.error);
			else alert.error('Unable to login. Please try again.');
		}
	};

	return (
		<Box>
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<Box
					sx={{
						marginTop: 8,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center'
					}}
				>
					<Avatar sx={{ m: 1, bgcolor: '#e3dee1' }} />
					<Typography component="h1" variant="h5">
						Sign in
					</Typography>
					<Box
						component="form"
						noValidate
						sx={{ mt: 1 }}
						onSubmit={handleLogin}
					>
						<TextField
							{...username}
							margin="normal"
							required
							fullWidth
							autoFocus
							autoComplete="username"
						/>
						<TextField
							{...password}
							margin="normal"
							required
							fullWidth
							type={showPassword ? 'text' : 'password'}
							autoComplete="current-password"
						/>
						<FormControlLabel
							control={
								<Checkbox
									value="Show password"
									color="primary"
								/>
							}
							label="Show password"
							onChange={() => setShow(!showPassword)}
						/>
						<FormControlLabel
							control={
								<Checkbox value="remember" color="primary" />
							}
							label="Remember me"
						/>
						{validateLoginForm(username.value, password.value) ? (
							<Button
								type="submit"
								fullWidth
								variant="contained"
								sx={{ mt: 3, mb: 2 }}
							>
								Sign In
							</Button>
						) : (
							<Button
								type="submit"
								fullWidth
								disabled
								variant="contained"
								sx={{ mt: 3, mb: 2 }}
							>
								Sign In
							</Button>
						)}
						<Grid container>
							<Grid item xs>
								<Link href="/forgot_password" variant="body2">
									Forgot password?
								</Link>
							</Grid>
							<Grid item>
								<Link href="/signup" variant="body2">
									Don't have an account? Sign Up
								</Link>
							</Grid>
						</Grid>
					</Box>
				</Box>
			</Container>
		</Box>
	);
};

export default LoginForm;
