import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
	Avatar, Box, Button,
	CssBaseline, TextField, Checkbox,
	Grid, FormControlLabel, Container,
	Link, Typography
} from '@mui/material';

import loginService from '../services/login';
import { useField } from '../hooks/index';
import { AlertContext } from './AlertProvider';
import { setLoggedUser, StateContext } from '../state';

const LoginForm = () => {
	const username = useField('text', 'Username')
	const password = useField('text', 'Password')

	const [showPassword, setShow] = useState(false)

	const alert = useContext(AlertContext);
	const navigate = useNavigate();

	const [, dispatch] = useContext(StateContext);

	const handleLogin = async (event: any) => {
		event.preventDefault();

		const userToLogin = {
			username: username.value,
			password: password.value
		};

		const loggedInUser = await loginService.login(userToLogin)
		if (loggedInUser.error) {
			console.log("error " + loggedInUser.error)
			alert.error(loggedInUser.error)
		} else {
			console.log(`User ${loggedInUser.username} logged in.`);
			alert.success(`Logged in successfuly. Welcome!`);
			dispatch(setLoggedUser(loggedInUser))
			navigate('/');
		}
	}

	return (
		<Box>
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<Box
					sx={{
						marginTop: 8,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}
				>
					<Avatar sx={{ m: 1, bgcolor: '#e3dee1' }} />
					<Typography component="h1" variant="h5">
						Sign in
					</Typography>
					<Box component="form" noValidate sx={{ mt: 1 }} onSubmit={handleLogin}>
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
							control={<Checkbox value="remember" color="primary" />}
							label="Remember me"
						/>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							sx={{ mt: 3, mb: 2 }}
						>
							Sign In
						</Button>
						<Grid container>
							<Grid item xs>
								<Link href="#" variant="body2">
									Forgot password?
								</Link>
							</Grid>
							<Grid item>
								<Link href="/signup" variant="body2">
									{"Don't have an account? Sign Up"}
								</Link>
							</Grid>
						</Grid>
					</Box>
				</Box>
			</Container>
		</Box>
	)
}

export default LoginForm;