//prettier-ignore
import { Avatar, Box, Button, TextField, Grid, Container, Link, Typography, Paper, styled } from '@mui/material';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useField } from '../../hooks/useField';
import { validateEmail } from '../../utils/inputValidators';
import { AlertContext } from '../AlertProvider';
import userService from '../../services/users';

const Item = styled(Paper)(({ theme }) => ({
	...theme.typography.body2,
	margin: '0 auto',
	padding: '1rem 2.5rem 4rem 2.5rem',
	// minWidth: '320px',
	maxWidth: '420px',
	textAlign: 'left',
	color: theme.palette.text.secondary
}));

const ForgotPasswordForm = () => {
	const email = useField('text', 'Email', validateEmail);
	const alert = useContext(AlertContext);
	const navigate = useNavigate();

	const handleForgotPwdRequest = async (event: any) => {
		event.preventDefault();

		try {
			await userService.requestPasswordReset(email.value);
			alert.success('Reset link sent! Please check your inbox.');
			navigate('/login');
		} catch (err) {
			alert.error(
				err.response?.data?.error || 'Unable to send a link. Please try again.'
			);
			navigate('/forgot_password');
		}
	};

	return (
		<Box sx={{ mt: 5, mb: 8 }}>
			<Container component="main" sx={{ maxWidth: "100%" }}>
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
							Reset Password
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
								InputLabelProps={{ shrink: true }}
							/>
							{validateEmail(email.value) === undefined ? (
								<Button
									type="submit"
									fullWidth
									variant="contained"
									sx={{ mt: 2, mb: 2 }}
								>
									Send
								</Button>
							) : (
								<Button
									fullWidth
									disabled
									variant="contained"
									sx={{ mt: 2, mb: 2 }}
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
				</Item>
			</Container>
		</Box>
	);
};

export default ForgotPasswordForm;
