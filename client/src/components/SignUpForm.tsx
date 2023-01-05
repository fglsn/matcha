//prettier-ignore
import { Avatar, Box, Button, TextField, FormControlLabel, Checkbox, Grid, Container, Link, Typography, Paper, styled } from '@mui/material';
//prettier-ignore
import { validateEmail, validateFirstame, validateLastname, validatePassword, validateUsername, validateSignUpForm } from '../utils/inputValidators';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertContext } from './AlertProvider';
import { useField } from '../hooks/useField';
import { NewUser } from '../types';
import userService from '../services/users';

const Item = styled(Paper)(({ theme }) => ({
	...theme.typography.body2,
	margin: '0 auto',
	padding: '1rem 2.5rem 4rem 2.5rem',
	minWidth: '320px',
	maxWidth: '420px',
	textAlign: 'left',
	color: theme.palette.text.secondary
}));

const SignUpForm = () => {
	const firstname = useField('text', 'First Name', validateFirstame);
	const lastname = useField('text', 'Last Name', validateLastname);
	const username = useField('text', 'Username', validateUsername);
	const email = useField('text', 'Email', validateEmail);
	const password = useField('text', 'Password', validatePassword);

	const [showPassword, setShow] = useState(false);

	const alert = useContext(AlertContext);
	const navigate = useNavigate();

	const addNewUser = async (newUser: NewUser) => {
		try {
			const addedUser = await userService.create(newUser);
			alert.success(
				`User ${addedUser.username} is created! Activation link is sent to email.`
			);
			navigate('/login');
		} catch (err) {
			alert.error(
				err.response?.data?.error || 'Unable to add a user. Please try again.'
			);
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
		<Box sx={{ mt: 5, mb: 6 }}>
			<Container component="main" maxWidth="sm">
				<Item>
					<Box
						sx={{
							marginTop: 6,
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
							sx={{ mt: 4 }}
						>
							<Grid container spacing={2}>
								<Grid item xs={12} sm={6}>
									<TextField
										{...firstname}
										required
										fullWidth
										autoFocus
										style={{ margin: '0 2 0 9' }}
										autoComplete="given-name"
									/>
								</Grid>
								<Grid item xs={12} sm={6}>
									<TextField
										{...lastname}
										required
										fullWidth
										style={{ margin: '0 2 0 9' }}
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
				</Item>
			</Container>
		</Box>
	);
};

export default SignUpForm;
