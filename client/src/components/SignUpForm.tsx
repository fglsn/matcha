import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
	Avatar,
	Box,
	Button,
	CssBaseline,
	TextField,
	FormControlLabel,
	Checkbox,
	Grid,
	Container,
	Link,
	Typography
} from '@mui/material';

import userService from '../services/users';
import { NewUser } from '../types';
import { useField } from '../hooks/useField';
import { AlertContext } from './AlertProvider';
import {
	validateEmail,
	validateFirstame,
	validateLastname,
	validatePassword,
	validateUsername,
	validateSignUpForm
} from '../utils/inputValidators';

// import { NewUser, User } from '../types';

const SignUpForm = () => {
	const firstname = useField('text', 'Name', validateFirstame);
	const lastname = useField('text', 'Surname', validateLastname);
	const username = useField('text', 'Username', validateUsername);
	const email = useField('text', 'Email', validateEmail);
	const password = useField('text', 'Password', validatePassword);

	const [showPassword, setShow] = useState(false);

	const alert = useContext(AlertContext);
	const navigate = useNavigate();

	const addNewUser = async (newUser: NewUser) => {
		const addedUser = await userService.create(newUser);
		// console.log('new user: ', JSON.stringify(addedUser))
		if (addedUser.error) {
			console.log('error ' + addedUser.error); //rm later
			alert.error(addedUser.error);
		} else {
			console.log(`a new user ${newUser.username} is added`); //rm later
			alert.success(
				`A new user ${newUser.username} is created! Activation link is sent.`
			);
			navigate('/login');
		}
	};

	const submitNewUser = (event: any) => {
		event.preventDefault();
		const newUser: NewUser = {
			username: username.value,
			email: email.value,
			passwordPlain: password.value,
			firstname: firstname.value,
			lastname: lastname.value
		};
		addNewUser(newUser);
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
						Sign up
					</Typography>
					<Box
						component="form"
						noValidate
						onSubmit={submitNewUser}
						sx={{ mt: 3 }}
					>
						<Grid container spacing={2}>
							<Grid item xs={12} sm={6}>
								<TextField
									{...firstname}
									required
									fullWidth
									autoFocus
									autoComplete="given-name"
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									{...lastname}
									required
									fullWidth
									autoComplete="family-name"
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									{...username}
									required
									fullWidth
									autoComplete="username"
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									{...email}
									required
									fullWidth
									autoComplete="email"
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									{...password}
									required
									fullWidth
									type={showPassword ? 'text' : 'password'}
									autoComplete="new-password"
								/>
							</Grid>
							<Grid item xs={12}>
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
							</Grid>
						</Grid>
						{validateSignUpForm(
							username.value,
							email.value,
							password.value,
							firstname.value,
							lastname.value
						) ? (
							<Button
								type="submit"
								fullWidth
								variant="contained"
								sx={{ mt: 3, mb: 2 }}
							>
								Sign Up
							</Button>
						) : (
							<Button
								type="submit"
								fullWidth
								disabled
								variant="contained"
								sx={{ mt: 3, mb: 2 }}
							>
								Sign Up
							</Button>
						)}
						<Grid container justifyContent="flex-end">
							<Grid item>
								<Link href="/login" variant="body2">
									Already have an account? Sign in
								</Link>
							</Grid>
						</Grid>
					</Box>
				</Box>
			</Container>
		</Box>
	);
};

export default SignUpForm;
