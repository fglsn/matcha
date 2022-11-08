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
	Typography
} from '@mui/material';

import userService from '../services/users';
import { useField } from '../hooks/index';
import {
	validateEmail
} from '../utils/inputValidators';

const ForgotPasswordForm = () => {
	const email = useField('text', 'Email', validateEmail);

	const navigate = useNavigate();

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	// const [searchParams, setSearchParams] = useSearchParams();
	// const activationCode = searchParams.get('activate');
	// const alert = useContext(AlertContext);

	// useEffect(() => {
	// 	const activateAccount = async () => {
	// 		if (activationCode) {
	// 			try {
	// 				await userService.activate(activationCode);
	// 				navigate('/login');
	// 				alert.success('Account activated successfully!');
	// 			} catch (err) {
	// 				console.log(err.response.data.error);
	// 				alert.error(err.response.data.error);
	// 				navigate('/login');
	// 			}
	// 		}
	// 	};
	// 	activateAccount();
	// }, [activationCode, alert, navigate]);

	const handleForgotPwdRequest = async (event: any) => {
		event.preventDefault();

		try {
			await userService.resetPassword(email.value);
			console.log(`Reset link sent!`); //rm later
			// alert.success(`Reset link sent! Please check your inbox.`);
			navigate('/login');
		} catch (err) {
			console.log(err.response.data.error); //rm later
			// alert.error(err.response.data.error);
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
						Sign in
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
							autoComplete="username"
						/>
						{validateEmail(email.value)  === undefined ? (
							<Button
								type="submit"
								fullWidth
								variant="contained"
								sx={{ mt: 3, mb: 2 }}
							>
								Reset Password
							</Button>
						) : (
							<Button
								fullWidth
								disabled
								variant="contained"
								sx={{ mt: 3, mb: 2 }}
							>
								Reset Password
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

export default ForgotPasswordForm;
