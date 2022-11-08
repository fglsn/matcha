import { useContext } from 'react';
import { AlertContext } from './AlertProvider';
import { AlertStatus } from '../types';

// import Alert from '@mui/material/Alert';
// import Snackbar from '@mui/material/Snackbar';
import { useSnackbar } from 'notistack';

export const AlertSnackBar = () => {
	const alert = useContext(AlertContext);

	const { enqueueSnackbar } = useSnackbar();

	if (alert.alert === AlertStatus.Error) {
		if (alert.alertText) {
			enqueueSnackbar(alert.alertText, { variant: 'error' });
		// 	return (
		// 		// <span onChange={handler}><Alert severity="error">{alert.alertText}</Alert></span>);
		// 		<Snackbar open anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
		// 			<Alert severity="error">{alert.alertText}</Alert>
		// 		</Snackbar>);
		// }
	}};

	if (alert.alert === AlertStatus.Success) {
		if (alert.alertText) {
			enqueueSnackbar(alert.alertText, { variant: 'success' });
		// 	return (
		// 		// <span onChange={handler}><Alert severity="error">{alert.alertText}</Alert></span>);
		// 		<Snackbar open anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
		// 			<Alert severity="error">{alert.alertText}</Alert>
		// 		</Snackbar>);
		// }
		// return (
		// 	<Snackbar open anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
		// 		<Alert severity="success">{alert.alertText}</Alert>
		// 	</Snackbar>);
	} };

	return null;
};
