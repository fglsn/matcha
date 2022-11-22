import { Paper, styled, Container, Grid, Alert } from '@mui/material';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useServiceCall } from '../../hooks/useServiceCall';
import { getProfile } from '../../services/profile';
import { logoutUser } from '../../services/logout';
import { useStateValue } from '../../state';
import { AuthError } from '../../utils/errors';
import { UserDataWithoutId } from '../../types';
import { AlertContext } from '../AlertProvider';
import withAuthRequired from '../AuthRequired';
import LoadingIcon from '../LoadingIcon';
import UpdateEmailForm from './UpdateEmailForm';
import UpdatePasswordForm from './UpdatePasswordForm';
import BasicInfoForm from './BasicInfoForm';
import Photos from './Photos';

const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
	...theme.typography.body2,
	padding: theme.spacing(2),
	textAlign: 'left',
	color: theme.palette.text.secondary
}));

const StyledButtons = styled('div')(() => ({
	background: 'white',
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'center',
	justifyContent: 'space-evenly',
	textAlign: 'center'
}));

const ProfileEditor = () => {
	const { error: errorCallback } = useContext(AlertContext);
	const [{ loggedUser }, dispatch] = useStateValue();
	const navigate = useNavigate();

	const {
		data,
		error
	}: { data: UserDataWithoutId | undefined; error: Error | undefined } = useServiceCall(
		async () => loggedUser && (await getProfile(loggedUser)),
		[loggedUser]
	);

	useEffect(() => {
		if (error) {
			if (error instanceof AuthError) {
				logoutUser(dispatch);
				errorCallback(error.message);
				navigate('/login');
			}
		}
	}, [dispatch, error, errorCallback, navigate]);

	if (error)
		return (
			<Alert severity="error">
				Error loading account settings page, please try again...
			</Alert>
		);

	if (!data) return <LoadingIcon />;

	const userData: UserDataWithoutId = {
		username: data.username,
		firstname: data.firstname,
		lastname: data.lastname,
		birthday: data.birthday,
		gender: data.gender,
		orientation: data.orientation,
		tags: data.tags,
		bio: data.bio
	};

	return (
		<>
			<Container maxWidth="lg" sx={{ mt: 8 }}>
				<Grid
					container
					columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 10 }}
					sx={{ flexDirection: { xs: 'column', sm: 'row' } }}
				>
					<Grid item xs={12} sm={6}>
						<Item>
							<BasicInfoForm userData={userData} />
							{/* <location here> */}
							<StyledButtons>
								<UpdateEmailForm />
								<UpdatePasswordForm />
							</StyledButtons>
						</Item>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Item>
							<Photos userData={userData} />
						</Item>
					</Grid>
				</Grid>
			</Container>
		</>
	);
};

export default withAuthRequired(ProfileEditor);
