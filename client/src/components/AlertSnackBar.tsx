import { useContext } from 'react';
import { AlertContext } from './AlertProvider';
import { AlertStatus } from '../types';

import Alert from '@mui/material/Alert';

export const AlertSnackBar = () => {
	const alert = useContext(AlertContext);

	if (alert.alert === AlertStatus.Error) {
		return <Alert severity="error">{alert.alertText}</Alert>;
	}

	if (alert.alert === AlertStatus.Success) {
		return <Alert severity="success">{alert.alertText}</Alert>;
	}

	return null;
};
