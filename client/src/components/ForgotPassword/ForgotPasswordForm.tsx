import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import {
	Avatar,
	Box,
	Button,
	CssBaseline,
	TextField,
	Grid,
	Container,
	Link,
	Typography,
} from '@mui/material';

import userService from '../../services/users';
import { useField } from '../../hooks/useField';
import { validateEmail } from '../../utils/inputValidators';
import { AlertContext } from '../AlertProvider';

const ForgotPasswordForm = () => {
	const email = useField('text', 'Email', validateEmail);
	const alert = useContext(AlertContext);
	const navigate = useNavigate();

	const handleForgotPwdRequest = async (event: any) => {
		event.preventDefault();

		try {
			await userService.requestPasswordReset(email.value);
			console.log(`Reset link sent!`); //rm later
			alert.success(`Reset link sent! Please check your inbox.`);
			navigate('/login');
		} catch (err) {
			console.log(err.response.data.error); //rm later
			alert.error(err.response.data.error);
			navigate('/forgot_password');
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
						Get Reset Link
					</Typography>
					<Box
						component="form"
						noValidate
						sx={{ mt: 1 }}
						onSubmit={handleForgotPwdRequest}
					>
						<TextField
							{...email}
							margin="normal"
							required
							fullWidth
							autoFocus
							type="text"
							autoComplete="username"
						/>
						{validateEmail(email.value) === undefined ? (
							<Button
								type="submit"
								fullWidth
								variant="contained"
								sx={{ mt: 3, mb: 2 }}
							>
								Send
							</Button>
						) : (
							<Button
								fullWidth
								disabled
								variant="contained"
								sx={{ mt: 3, mb: 2 }}
							>
								Send
							</Button>
						)}
						<Grid container>
							<Grid item xs>
								<Link href="/login" variant="body2">
									Back to sign in
								</Link>
							</Grid>
							<Grid item>
								<Link href="/signup" variant="body2">
									Sign Up
								</Link>
							</Grid>
						</Grid>
					</Box>
				</Box>
			</Container>
		</Box>
	);
};

export default ForgotPasswordForm;