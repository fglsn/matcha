//prettier-ignore
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button } from "@mui/material";
import { useContext, useState } from 'react';
import { useFieldWithReset } from '../../hooks/useField';
import { validateEmail } from '../../utils/inputValidators';
import { AlertContext } from '../AlertProvider';
import { useStateValue } from '../../state';
import profileService from '../../services/profile';

const UpdateEmailForm = () => {
	const { success: successCallback, error: errorCallback } = useContext(AlertContext);
	const [{ loggedUser }] = useStateValue();
	const { reset, ...email } = useFieldWithReset('text', 'Email', validateEmail);
	const [open, setOpen] = useState(false);

	const handleClickOpen = () => setOpen(true);

	const handleClose = () => {
		setOpen(false);
		reset();
	};

	const requestUpdateEmailAndHandleError = async ({
		id,
		email
	}: {
		id: string;
		email: string;
	}) => {
		try {
			await profileService.requestUpdateEmail({ id, email });
			successCallback(`Activation link sent to new email.`);
		} catch (err) {
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
			<Button onClick={handleClickOpen} color={undefined} style={dialogBtn}>
				Change Email
			</Button>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>Change email</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Activation link will be sent to the email address provided. <br />
						Please follow the link from our message in order to set your new email
						address.
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
};

const dialogBtn = {
	margin: '10px 0 5px 0',
	padding: '5px 25px',
	maxWidth: '100%'
};

export default UpdateEmailForm;
