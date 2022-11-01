import Alert from '@mui/material/Alert'
import { AlertStatus } from '../types'

const AlertSnackBar = ({alert, text}: any) => {

	if (alert === AlertStatus.Error) {

		return (
			<Alert severity="error">{text}</Alert>
		)
	}

	if (alert === AlertStatus.Success) {
		return (
			<Alert severity="success">{text}</Alert>
		)
	}

	return <></>
}

export default AlertSnackBar;
