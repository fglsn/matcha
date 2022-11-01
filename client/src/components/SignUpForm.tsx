import * as React from 'react';
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
} from '@mui/material'

import { useField } from '../hooks';
import { NewUser } from '../types';
// import { NewUser, User } from '../types';

import userService from '../services/users'
import { useContext, useState } from 'react';
import { NotificationContext } from './NotificationProvider';

const SignUpForm = () => {
	const firstname = useField('text', 'Name')
	const lastname = useField('text', 'Surname')
	const username = useField('text', 'Username')
	const email = useField('text', 'Email')
	const password = useField('text', 'Password')

	const [showPassword, setShow] = useState(false)

	const notification = useContext(NotificationContext);

	const displayError = (error: string) => {
		notification.setNotification(error);
	}

	const displayInfo = (info: string) => {
		notification.setNotification(info)
	}

	const addNewUser = async (newUser: NewUser) => {
		const addedUser = await userService.create(newUser);
		// console.log('new user: ', JSON.stringify(addedUser))
		if (addedUser.error) {	
			console.log("error " + addedUser.error)
			displayError(addedUser.error)
		} else {
			console.log(`a new user ${newUser.username} is added`);
			displayInfo(`A new user ${newUser.username} is created!`)
		}
	}

	const submitNewUser = (event: any) => {
		event.preventDefault()
		const newUser: NewUser = {
			username: username.value,
			email: email.value,
			passwordPlain: password.value,
			firstname: firstname.value,
			lastname: lastname.value
		};
		addNewUser(newUser);
		// console.log(newUser);
		// console.log('submit called');
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
									autoFocus
									autoComplete="family-name"
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									{...username}
									required
									fullWidth
									autoFocus
									autoComplete="username"
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									{...email}
									required
									fullWidth
									autoFocus
									id="email"
									autoComplete="email"
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									{...password}
									required
									fullWidth
									type={showPassword ? 'text' : 'password'}
									id="password"
									autoComplete="new-password"
								/>
							</Grid>
							<Grid item xs={12}>
								<FormControlLabel
									control={
										<Checkbox
											value="allowExtraEmails"
											color="primary"
										/>
									}
									label="Show password"
									onChange={() => setShow(!showPassword)}
								/>
							</Grid>
						</Grid>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							sx={{ mt: 3, mb: 2 }}
						>
							Sign Up
						</Button>
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
}

export default SignUpForm;