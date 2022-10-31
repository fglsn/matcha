import Alert from '@mui/material/Alert'

const Notification = ({ error, info }: any) => {
	// if (error === null && info === null) {
	// 	return null
	// }

	if (error !== '') {
		return (
			<><Alert severity="error">{error}</Alert></>
			
		)
	}

	if (info !== '') {
		return (
			<><Alert severity="success">{info}</Alert></>
		)
	}

	return <></>
}

export default Notification
