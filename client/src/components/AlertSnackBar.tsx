import { useContext, useEffect } from 'react';
import { AlertContext } from './AlertProvider';
import { AlertStatus } from '../types';

// import Alert from '@mui/material/Alert';
// import Snackbar from '@mui/material/Snackbar';
import { useSnackbar } from 'notistack';

const AlertSnackBar = () => {
	const alert = useContext(AlertContext);

	const { enqueueSnackbar } = useSnackbar();

	useEffect(() => {
		const showAlert = () => {
			if (alert.alert === AlertStatus.Error) {
				if (alert.alertText) {
					enqueueSnackbar(alert.alertText, { variant: 'error', autoHideDuration: 1500 });
				};
			};
			if (alert.alert === AlertStatus.Success) {
				if (alert.alertText) {
					enqueueSnackbar(alert.alertText, { variant: 'success', autoHideDuration: 1500 });
				};
			};
		};
		showAlert();
	}, [alert.alert, alert.alertText, enqueueSnackbar]);

return null;

};

export default AlertSnackBar;