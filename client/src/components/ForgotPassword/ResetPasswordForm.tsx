import { useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import { useField } from '../../hooks/useField';
import { AlertContext } from '../AlertProvider';
import { validatePassword } from '../../utils/inputValidators';
import userService from '../../services/users';

import {
	Avatar,
	Box,
	Button,
	TextField,
	Grid,
	Container,
	Link,
	Typography,
	Checkbox,
	FormControlLabel,
	Paper,
	styled
} from '@mui/material';


import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

const Item = styled(Paper)(({ theme }) => ({
	...theme.typography.body2,
	margin: '0 auto',
	padding: '1rem 2.5rem 4rem 2.5rem',
	// minWidth: '320px',
	maxWidth: '420px',
	textAlign: 'left',
	color: theme.palette.text.secondary
}));

const ResetPasswordForm = ({ token }: { token: string }) => {
	const password = useField('text', 'Password', validatePassword);
	const navigate = useNavigate();
	const alert = useContext(AlertContext);
	const [showPassword, setShow] = useState(false);

	const handleResetPassword = async (event: any) => {
		event.preventDefault();

		try {
			await userService.resetPassword(token, password.value);
			alert.success('Password changed successfully!');
			navigate('/login');
		} catch (err) {
			alert.error(
				err.response?.data?.error || 'Unable to reset password. Please try again.'
			);
			navigate('/forgot_password');
		}
	};

	return (
		<Box>
			<Container component="main" sx={{ maxWidth: "100%" }}>
				<Item>
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
							<Grid item xs={12} sx={{ marginLeft: '5px' }}>
								<FormControlLabel
									label={
										<Box component="div" fontSize={'0.9rem'}>
											Show password
										</Box>
									}
									control={
										<Checkbox
											color="primary"
											onChange={() => setShow(!showPassword)}
											icon={
												<VisibilityOffOutlinedIcon fontSize="small" />
											}
											checkedIcon={<VisibilityOutlinedIcon />}
										/>
									}
								/>
							</Grid>
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
				</Item>
			</Container>
		</Box>
	);
};

export default ResetPasswordForm;
