import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useServiceCall } from '../../hooks/useServiceCall';
import { getProfilePage } from '../../services/profile';
import { logoutUser } from '../../services/logout';
import { useStateValue } from '../../state';
import { AuthError } from '../../utils/errors';
import { UserDataWithoutId } from '../../types';
import { AlertContext } from '../AlertProvider';
import withAuthRequired from '../AuthRequired';
import LoadingIcon from '../LoadingIcon';
import Alert from '@mui/material/Alert';
import BasicInfo from './BasicInfoSection';
import { Paper, styled, Container, Grid, Button } from '@mui/material';
import PicturesSection from './PicturesSection';

const style = {
	container: {
		marginTop: '4rem'
	},
	paper: {
		backgroundColor: '#b5bec6ff',
		padding: '5rem'
	}
};

const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
	...theme.typography.body2,
	padding: theme.spacing(1),
	textAlign: 'left',
	color: theme.palette.text.secondary,
}));

const Profile = () => {
	const { error: errorCallback } = useContext(AlertContext);

	const { data, error }: { data: UserDataWithoutId | undefined; error: Error | undefined } = useServiceCall(getProfilePage);

	const [, dispatch] = useStateValue();
	const navigate = useNavigate();

	// // to be changed
	// window.onblur = function () {
	// 	window.onfocus = function () {
	// 		// eslint-disable-next-line no-restricted-globals
	// 		location.reload();
	// 	};
	// };

	useEffect(() => {
		if (error) {
			if (error instanceof AuthError) {
				logoutUser(dispatch);
				errorCallback(error.message);
				navigate('/login');
			}
		}
	}, [dispatch, error, errorCallback, navigate]);

	if (error) return <Alert severity="error">Error Loading Profile...</Alert>;

	if (!data) return <LoadingIcon />;

	const userData: UserDataWithoutId = {
		username: data.username,
		email: data.email,
		firstname: data.firstname,
		lastname: data.lastname,
		birthday: data.birthday,
		gender: data.gender,
		orientation: data.orientation,
		bio: data.bio
	};

	//render form sections
	return (
		<>
			<Container maxWidth="lg" style={style.container}>
				<Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ flexDirection: { xs: "column", sm: "row" } }}>
					<Grid item xs={12} sm={6}>
						<Item>
							<BasicInfo userData={userData} />
							<Button
								type="submit"
								disabled
								variant="contained"
								sx={{ mt: 3, mb: 2, ml: 2 }}
							>
								Update Info
							</Button>
						</Item>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Item><PicturesSection /></Item>
					</Grid>
				</Grid>
			</Container>

			{/* <div>hello {data.username}</div> */}
		</>
	);
};

export default withAuthRequired(Profile);
