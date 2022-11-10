import { Paper, Box, Container } from '@mui/material';
import { BaseUser } from '../../types';

const style = {
	container: {
		marginTop: '10rem'
	},
	paper: {
		backgroundColor: '#b5bec6ff',
		padding: '5rem'
	}
};

const BasicInfo: React.FC<{ baseUserData: BaseUser }> = ({ baseUserData }) => {
	return (
		<>
			<Container maxWidth="sm" style={style.container}>
				{' '}
				<Box>
					<Paper elevation={3} style={style.paper}>
						<p>Name: {baseUserData.firstname}</p>
						<p>Surname: {baseUserData.lastname}</p>
						<p>Email: {baseUserData.email}</p>
						<p>Username: {baseUserData.username}</p>
					</Paper>
				</Box>
			</Container>
		</>
	);
};

export default BasicInfo;
