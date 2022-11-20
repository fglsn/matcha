//prettier-ignore
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button } from "@mui/material";
import { useContext, useState } from 'react';
import { useFieldWithReset } from '../../hooks/useField';
import { validateEmail } from '../../utils/inputValidators';
import { AlertContext } from '../AlertProvider';
import { useStateValue } from '../../state';
import accountService from '../../services/profile';

const UpdateEmailForm = () => {
	const { success: successCallback, error: errorCallback } = useContext(AlertContext);
	const [{ loggedUser }] = useStateValue();
	const { reset, ...email } = useFieldWithReset('text', 'Email', validateEmail);
	const [open, setOpen] = useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
		reset();
	};

	const requestUpdateEmailAndHandleError = async ({ id, email }: { id: string, email: string }) => {
		try {
			await accountService.requestEmailUpdate({id, email});
			successCallback(`Activation link sent to new email.`);
		} catch (err) {
			console.log('Error in requestUpdateEmailAndHandleError (UpdateEmailForm) ' + err); //rm later
			errorCallback(
				err.response?.data?.error ||
					'Unable to update email address. Please try again.'
			);
		}
	};

	const handleSumbit = (event: any) => {
		event.preventDefault();
		if (loggedUser)
			requestUpdateEmailAndHandleError({ id: loggedUser?.id, email: email.value });
		setOpen(false);
		reset();
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

export default UpdateEmailForm;