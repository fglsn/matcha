import { Box } from '@mui/material';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { AlertContext } from '../AlertProvider';
import withAuthRequired from '../AuthRequired';

import profileService from '../../services/profile';

const Profile = () => {
	const alert = useContext(AlertContext);
	const navigate = useNavigate();
	// const [userData, setUserData] = useState(undefined);

	useEffect(() => {
		const accessProfilePage = async () => {
			try {
				await profileService.getProfilePage();
				console.log('User valid'); //rm later
			} catch (err) {
				console.log(err);
				alert.error(err);
				navigate('/login');
			}
		};
		accessProfilePage();
	}, [alert, navigate]);

	// const [{ loggedUser }] = useContext(StateContext);

	// useEffect(() => {
	// 	if (loggedUser) {
	// 		getUserInfo(loggedUser.id);
	// 	}
	// }, [loggedUser]);

	// const getUserInfo = async (userId: string) => {
	// 	try {
	// 		const userDataObj = await userService.getUserData(userId);
	// 		setUserData(userDataObj);
	// 	} catch (err) {
	// 		console.log(err.response.data.error); //rm later
	// 	}
	// }

	return <Box>PROFILE ACCESS OK</Box>
}

export default withAuthRequired(Profile);