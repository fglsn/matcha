import { styled, Alert, Container, Paper } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useServiceCall } from '../../hooks/useServiceCall';
import { getPhotos, getProfile } from '../../services/profile';
import { Images, UserData } from '../../types';
import LoadingIcon from '../LoadingIcon';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ClearIcon from '@mui/icons-material/Clear';
import Photos from './Photos';

const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: 'primary',
	...theme.typography.body2,
	padding: theme.spacing(2),
	textAlign: 'left',
	color: theme.palette.text.secondary
}));

const StyledContainer = styled(Container)({
	maxHeight: '750px',
	maxWidth: 'auto',
	display: 'flex',
	justifyContent: 'center'
});

const IconGroup = styled('div')({
	display: 'flex',
	flexDirection: 'row',
	position: 'relative',
	justifyContent: 'center'
});

// const IconWrapper = styled('div')({
// 	height: '65px',
// 	width: '65px',
// 	borderRadius: 50,
// 	backgroundColor: 'white!important',
// 	border: '1px solid #dcdcdc',
// 	position: 'relative',
// 	margin: '0 45px',
// 	transformOrigin: '2 2 2'
// });

const IconWrapper = styled('div')`
	height: 65px;
	width: 65px;
	border-radius: 50px;
	background-color: white !important;
	border: 1px solid #dcdcdc;
	position: relative;
	margin: 0 45px;
	&:hover {
		transform: scale(1.1);
	}
`;

const StyledLikeIcon = styled(FavoriteIcon)({
	position: 'absolute',
	color: 'primary',
	zIndex: 1,
	top: '34%',
	left: '31%'
});

const StyledDislikeIcon = styled(ClearIcon)({
	position: 'absolute',
	color: 'primary',
	zIndex: 1,
	top: '33%',
	left: '31%'
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
				<Item>
					<Photos photos={photosData.images} />
					<IconGroup>
						<IconWrapper>
							<StyledDislikeIcon color="inherit" />
						</IconWrapper>

						<IconWrapper>
							<StyledLikeIcon color="primary" />
						</IconWrapper>
					</IconGroup>
				</Item>
				{/* <Item sx={{ marginTop: '2rem' }}></Item> */}
			</StyledContainer>
		</>
	);
};

export default PublicProfile;
