import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { useField } from "../../hooks/useField";
import { AlertContext } from '../AlertProvider';
import { validatePassword } from "../../utils/inputValidators";
import userService from '../../services/users';

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
	Checkbox,
	FormControlLabel
} from '@mui/material';

const ResetPasswordForm = ({ token }: {token: string}) => {
	const [showPassword, setShow] = useState(false);
	const password = useField('text', 'Password', validatePassword);
	const navigate = useNavigate();
	const alert = useContext(AlertContext);

	const handleResetPassword = async (event: any) => {
		event.preventDefault();

		try {
			await userService.resetPassword(token, password.value);
			console.log('Password changed successfully!'); //rm later
			alert.success('Password changed successfully!');
			navigate('/login');
		} catch (err) {
			console.log(`Error in handleResetPassword (ResetPasswordForm): ${err} `); //rm later
			alert.error(err.response.data?.error);
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
						Set new password
					</Typography>
					<Box
						component="form"
						noValidate
						sx={{ mt: 1 }}
						onSubmit={handleResetPassword}
					>
						<input
							hidden
							type="text"
							readOnly
							autoComplete="username"
							value="{{ }}"
						></input>
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
						{validatePassword(password.value) === undefined ? (
							<Button
								type="submit"
								fullWidth
								variant="contained"
								sx={{ mt: 3, mb: 2 }}
							>
								Submit
							</Button>
						) : (
							<Button
								fullWidth
								disabled
								variant="contained"
								sx={{ mt: 3, mb: 2 }}
							>
								Submit
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

export default ResetPasswordForm;