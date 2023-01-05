import { Paper, styled, Container, Grid, Alert } from '@mui/material';
import { getPhotos, getProfile } from '../../services/profile';
import { useServiceCall } from '../../hooks/useServiceCall';
import { useStateValue } from '../../state';
import { Images, UserData } from '../../types';
import withAuthRequired from '../AuthRequired';
import UpdatePasswordForm from './UpdatePasswordForm';
import UpdateEmailForm from './UpdateEmailForm';
import BasicInfoForm from './BasicInfoForm';
import LoadingIcon from '../LoadingIcon';
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
		async () => loggedUser && (await getProfile(loggedUser.id)),
		[loggedUser]
	);

	const {
		data: photosData,
		error: photosError
	}: { data: Images | undefined; error: Error | undefined } = useServiceCall(
		async () => loggedUser && (await getPhotos(loggedUser.id)),
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
		location: profileData.location,
		fameRating: profileData.fameRating
	};

	return (
		<>
			<Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
				<Grid
					container
					columnSpacing={{ xs: 2, sm: 3, md: 4, lg: 10 }}
					rowSpacing={{ xs: 2, sm: 3 }}
					sx={{
						flexDirection: { xs: 'column', sm: 'row' },
						justifyContent: 'center',
						alignContent: 'center'
					}}
				>
					<Grid
						sx={{ width: '100%' }}
						maxWidth={{ xs: '100%', sm: '55%', md: '55%', lg: '50%' }}
						flexBasis={{ xs: '100%', sm: '55%', md: '55%', lg: '50%' }}
						item
						xs={12}
						sm={6}
					>
						<Item>
							<BasicInfoForm userData={userData} />
						</Item>
					</Grid>
					<Grid
						sx={{ width: '100%' }}
						maxWidth={{ xs: '100%', sm: '45%', md: '45%', lg: '50%' }}
						flexBasis={{ xs: '100%', sm: '45%', md: '45%', lg: '50%' }}
						item
						xs={12}
						sm={6}
					>
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
