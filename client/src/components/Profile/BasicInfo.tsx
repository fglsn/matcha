import { Alert, AlertTitle, Box } from "@mui/material";

const BasicInfo = () => {
	return (
		<Box>
			<Alert severity="info">
				<AlertTitle>Personal info</AlertTitle>
				{/* <p>Name: {user.firstname}</p>
				<p>Surname: {user.lastname}</p>
				<p>Email: {user.email}</p>
				<p>Username: {user.username}</p> */}
			</Alert>
		</Box>
	)
};

export default BasicInfo;