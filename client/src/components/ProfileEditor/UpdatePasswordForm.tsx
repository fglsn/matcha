//prettier-ignore
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button, Checkbox, FormControlLabel } from "@mui/material";
//prettier-ignore
import { validatePassword, validateUpdatePasswordForm } from '../../utils/inputValidators';
import { useContext, useState } from 'react';
import { useFieldWithReset } from '../../hooks/useField';
import { AlertContext } from '../AlertProvider';
import { useStateValue } from '../../state';
import profileService from '../../services/profile';

const UpdatePasswordForm = () => {
	const { reset, ...oldPassword } = useFieldWithReset(
		'text',
		'Current Password',
		validatePassword
	);
	const { reset: pwdReset, ...password } = useFieldWithReset(
		'text',
		'New Password',
		validatePassword
	);
	const { success: successCallback, error: errorCallback } = useContext(AlertContext);
	const [{ loggedUser }] = useStateValue();
	const [showOldPassword, setShowOldPassword] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [open, setOpen] = useState(false);

	const handleClickOpen = () => setOpen(true);

	const handleClose = () => {
		setOpen(false);
		reset();
		pwdReset();
	};

	const requestUpdatePassword = async ({
		id,
		oldPassword,
		password
	}: {
		id: string;
		oldPassword: string;
		password: string;
	}) => {
		try {
			await profileService.updatePassword({ id, oldPassword, password });
			successCallback(`Password was changed successfully.`);
		} catch (err) {
			errorCallback(
				err.response?.data?.error ||
					'Unable to update password address. Please try again.'
			);
		}
	};

	const handleSumbit = (event: any) => {
		event.preventDefault();
		if (loggedUser)
			requestUpdatePassword({
				id: loggedUser?.id,
				oldPassword: oldPassword.value,
				password: password.value
			});
		handleClose();
	};

	return (
		<div>
			<Button onClick={handleClickOpen} style={dialogBtn}>
				Change Password
			</Button>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>Change Password</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Please enter your current password in order to safely change it.
					</DialogContentText>
					<TextField
						{...oldPassword}
						autoFocus
						margin="dense"
						fullWidth
						type={showOldPassword ? 'text' : 'password'}
						required
						variant="standard"
					/>
					<FormControlLabel
						control={<Checkbox value="Show current password" color="primary" />}
						label="Show current password"
						onChange={() => setShowOldPassword(!showOldPassword)}
					/>
					<TextField
						{...password}
						margin="dense"
						fullWidth
						type={showPassword ? 'text' : 'password'}
						required
						variant="standard"
					/>
					<FormControlLabel
						control={<Checkbox value="Show password" color="primary" />}
						label="Show password"
						onChange={() => setShowPassword(!showPassword)}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Cancel</Button>
					{oldPassword.value &&
					password.value &&
					validateUpdatePasswordForm(oldPassword.value, password.value) ? (
						<Button onClick={handleSumbit}>Send</Button>
					) : (
						<Button disabled>Send</Button>
					)}
				</DialogActions>
			</Dialog>
		</div>
	);
};

const dialogBtn = {
	margin: '10px 0 5px 0',
	padding: '5px 25px',
	maxWidth: '100%'
};

export default UpdatePasswordForm;
