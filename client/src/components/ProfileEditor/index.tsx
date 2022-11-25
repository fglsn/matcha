import { Paper, styled, Container, Grid, Alert } from '@mui/material';
import { useServiceCall } from '../../hooks/useServiceCall';
import { getPhotos, getProfile } from '../../services/profile';
import { useStateValue } from '../../state';
import { Images, UserData } from '../../types';
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
	const [{ loggedUser }] = useStateValue();

	const {
		data: profileData,
		error: profileError
	}: { data: UserData | undefined; error: Error | undefined } = useServiceCall(
		async () => loggedUser && (await getProfile(loggedUser)),
		[loggedUser]
	);

	const {
		data: photosData,
		error: photosError
	}: { data: Images | undefined; error: Error | undefined } = useServiceCall(
		async () => loggedUser && (await getPhotos(loggedUser)),
		[loggedUser]
	);

	if (profileError || photosError)
		return (
			<Alert severity="error">
				Error loading account settings page, please try again...
			</Alert>
		);

	if (!profileData || !photosData) return <LoadingIcon />;

	const userData: UserData = {
		username: profileData.username,
		firstname: profileData.firstname,
		lastname: profileData.lastname,
		birthday: profileData.birthday,
		gender: profileData.gender,
		orientation: profileData.orientation,
		tags: profileData.tags,
		bio: profileData.bio,
		coordinates: profileData.coordinates,
		location: profileData.location
	};

	return (
		<>
			<Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
				<Grid
					container
					columnSpacing={{ xs: 2, sm: 3, md: 4, lg: 10 }}
					sx={{ flexDirection: { xs: 'column', sm: 'row' } }}
				>
					<Grid item xs={12} sm={6}>
						<Item>
							<BasicInfoForm userData={userData} />
						</Item>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Item>
							<Photos photos={photosData.images} />
						</Item>
						<Item sx={{ marginTop: '2rem' }}>
							<StyledButtons>
								<UpdateEmailForm />
								<UpdatePasswordForm />
							</StyledButtons>
						</Item>
					</Grid>
				</Grid>
			</Container>
		</>
	);
};

export default withAuthRequired(ProfileEditor);
