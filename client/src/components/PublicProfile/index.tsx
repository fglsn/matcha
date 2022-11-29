import { styled, Alert, Container, Grid, Paper } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useServiceCall } from '../../hooks/useServiceCall';
import { getPhotos, getProfile } from '../../services/profile';
import { Images, UserData } from '../../types';
import LoadingIcon from '../LoadingIcon';
// import BasicInfoForm from '../ProfileEditor/BasicInfoForm';
import Photos from './Photos';

const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: 'primary',
	...theme.typography.body2,
	padding: theme.spacing(2),
	textAlign: 'left',
	color: theme.palette.text.secondary
}));

const StyledContainer = styled(Container)({
	height: '550px',
	width: '600px',
	margin: '0 auto'
});

const PublicProfile = () => {
	const { id } = useParams();

	const {
		data: profileData,
		error: profileError
	}: { data: UserData | undefined; error: Error | undefined } = useServiceCall(
		async () => id && (await getProfile(id)),
		[]
	);

	const {
		data: photosData,
		error: photosError
	}: { data: Images | undefined; error: Error | undefined } = useServiceCall(
		async () => id && (await getPhotos(id)),
		[]
	);

	if (profileError || photosError)
		return (
			<Alert severity="error">
				Error loading account settings page, please try again...
			</Alert>
		);

	if (!profileData || !photosData) return <LoadingIcon />;

	// const userData: UserData = {
	// 	username: profileData.username,
	// 	firstname: profileData.firstname,
	// 	lastname: profileData.lastname,
	// 	birthday: profileData.birthday,
	// 	gender: profileData.gender,
	// 	orientation: profileData.orientation,
	// 	tags: profileData.tags,
	// 	bio: profileData.bio,
	// 	coordinates: profileData.coordinates,
	// 	location: profileData.location
	// };

	return (
		<>
			<StyledContainer maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
				<Grid container>
					<Grid item>
						<Item>
							<Photos photos={photosData.images} />
						</Item>
						{/* <Item sx={{ marginTop: '2rem' }}></Item> */}
					</Grid>
				</Grid>
			</StyledContainer>
		</>
	);
};

export default PublicProfile;
