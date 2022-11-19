//prettier-ignore
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button } from "@mui/material";
import { useContext, useState } from 'react';
import { useField } from '../../hooks/useField';
import { validateEmail } from '../../utils/inputValidators';
import { AlertContext } from '../AlertProvider';
import accountService from '../../services/account';

export default function ChangeEmail() {
	const { success: successCallback, error: errorCallback } = useContext(AlertContext);
	const email = useField('text', 'Email', validateEmail);
	const [open, setOpen] = useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const sendUpdateEmailLink = async ({ email }: { email: string }) => {
		try {
			const res = await accountService.updateEmail({email});
			console.log(res.body);
			successCallback(`Activation link sent to new email.`);
		} catch (err) {
			console.log('Error in sendUpdateEmailLink (ChangeEmail) ' + err); //rm later
			errorCallback(
				err.response?.data?.error ||
					'Unable to update email address. Please try again.'
			);
		}
	};

	const handleSumbit = (event: any) => {
		event.preventDefault();
		sendUpdateEmailLink({email: email.value});
		setOpen(false);
	};

	return (
		<div>
			<Button variant="outlined" onClick={handleClickOpen}>
				Change Email
			</Button>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>Change email</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Activation link will be sent to the email address provided. <br />
						Please follow the link from our message in order to set your new
						email address.
					</DialogContentText>
					<TextField
						{...email}
						autoFocus
						margin="dense"
						fullWidth
						variant="standard"
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Cancel</Button>
					<Button onClick={handleSumbit}>Send</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
