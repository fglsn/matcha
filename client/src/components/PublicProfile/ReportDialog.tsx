//prettier-ignore
import { Button, useTheme, useMediaQuery, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, styled } from "@mui/material";
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import { reportProfile } from '../../services/profile';
import { useStateValue } from '../../state';
import { AlertContext } from '../AlertProvider';
import EmojiFlagsIcon from '@mui/icons-material/EmojiFlags';

const StyledReportButton = styled('div')`
	cursor: pointer;
	display: flex;
	align-items: baseline;
	font-size: 11px;
	text-align: left;
	// position: relative;
	// bottom: 10px;
	width: fit-content;
	color: #808080d4;
	border-bottom: 1px solid #80808070;
`;

const ReportDialog: React.FC<{
	id: string | undefined;
	username: string;
	setIsBlocked: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ id, username, setIsBlocked }) => {
	const { success: successCallback, error: errorCallback } = useContext(AlertContext);
	const [open, setOpen] = useState<boolean>(false);
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
	const [{ loggedUser }] = useStateValue();
	const navigate = useNavigate();

	const reportFakeAccount = async (id: string) => {
		try {
			await reportProfile(id);
			successCallback('Thank you, account is reported.');
			setIsBlocked(true);
			navigate('/');
		} catch (e) {
			errorCallback(e.message);
		}
	};

	const handleClickOpen = () => setOpen(true);

	const handleClose = () => setOpen(false);

	const handleReport = (event: any) => {
		event.preventDefault();
		if (!id) return;
		reportFakeAccount(id);
		setOpen(false);
	};

	return (
		<>
			<StyledReportButton
				onClick={loggedUser?.id === id ? undefined : handleClickOpen}
			>
				<EmojiFlagsIcon
					style={{ height: '10px', width: '10px', marginRight: 3 }}
				/>
				Report fake account
			</StyledReportButton>
			<Dialog
				fullScreen={fullScreen}
				open={open}
				onClose={handleClose}
				aria-labelledby="responsive-dialog-title"
			>
				<DialogTitle id="responsive-dialog-title">
					{`Do you want to report account @${username} as fake?`}
				</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Your report is anonymous. <br />
						Please note that this action cannot be undone.
						<br /> This account will be hidden from your search results and
						you won't recieve any additional notifications from this account
						nor be able to chat if you're connected.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Cancel</Button>
					<Button onClick={handleReport}>Report</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default ReportDialog;
