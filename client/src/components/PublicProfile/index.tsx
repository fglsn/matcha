import { styled, Alert, Container, Paper, Tooltip, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { getPhotos, getProfile } from '../../services/profile';
import { useServiceCall } from '../../hooks/useServiceCall';
import { Images, UserData } from '../../types';
import { useContext, useState } from 'react';
import { AlertContext } from '../AlertProvider';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import ClearIcon from '@mui/icons-material/Clear';
import LoadingIcon from '../LoadingIcon';
import ProfileSlider from './ProfileSlider';

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
	justifyContent: 'center',
	height: '1rem',
	bottom: '35px'
});

const IconWrapper = styled('div')`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 70px;
	width: 70px;
	border-radius: 50px;
	background-color: white !important;
	border: 1px solid #dcdcdc;
	position: relative;
	margin: 0 45px;
	&:hover {
		transition: 0.2s ease;
		transform: scale(1.1);
	}
`;

const IconWrapperPressed = styled('div')`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 80px;
	width: 80px;
	border-radius: 50px;
	background-color: #ff0073 !important;
	border: 1px;
	size: scale(1.1);
	position: relative;
	bottom: 5px;
	margin: 0 45px;
	&:hover {
		transition: 0.2s ease;
		transform: scale(1.1);
	}
`;

const StyledLikeIcon = styled(FavoriteIcon)({
	color: 'primary',
	zIndex: 1
});

const StyledDislikeIcon = styled(ClearIcon)({
	color: 'primary',
	zIndex: 1
});

const UserInfo = styled('div')`
	display: flex;
	align-items: flex-end;
	flex-direction: column;
`;

export const StyledRow = styled('div')`
	display: flex;
	flex-direction: row;
	align-items: baseline;
`;

const PublicProfile = () => {
	const { id } = useParams();
	const { success: successCallback } = useContext(AlertContext);
	const [isLiked, setIsLiked] = useState<boolean>(false);
	const [isBlocked, setIsBlocked] = useState<boolean>(false);
	const navigate = useNavigate();

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

	const likeUser = (event: any) => {
		event.preventDefault();
		setIsLiked(!isLiked);
	};

	const blockUser = (event: any) => {
		event.preventDefault();
		setIsBlocked(true);
		if (isLiked) {
			setIsLiked(false);
			successCallback(`Like removed and ${userData.username} won't appear again`);
		}
		navigate('/');
	};

	const GenderIcon: React.FC<{ gender: string | undefined }> = ({ gender }) => {
		//remove undefined
		switch (gender) {
			case 'male':
				return <MaleIcon color="primary" />;
			case 'female':
				return <FemaleIcon color="primary" />;
			default:
				return <></>;
		}
	};

	return (
		<>
			<StyledContainer maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
				<Item>
					<ProfileSlider photos={photosData.images} user={userData} />
					<IconGroup>
						<Tooltip title="Pass / Block" arrow placement="top">
							{isBlocked ? (
								<IconWrapperPressed onClick={blockUser}>
									<StyledDislikeIcon color="secondary" />
								</IconWrapperPressed>
							) : (
								<IconWrapper onClick={blockUser}>
									<StyledDislikeIcon color="inherit" />
								</IconWrapper>
							)}
						</Tooltip>
						<Tooltip
							title={isLiked ? 'Unlike' : 'Like'}
							arrow
							placement="top"
						>
							{isLiked ? (
								<IconWrapperPressed onClick={likeUser}>
									<StyledLikeIcon color="secondary" />
								</IconWrapperPressed>
							) : (
								<IconWrapper onClick={likeUser}>
									<StyledLikeIcon color="primary" />
								</IconWrapper>
							)}
						</Tooltip>
					</IconGroup>
					<UserInfo>
						<Typography sx={{ mt: 2 }}>
							@{userData.username.toLowerCase()}
						</Typography>
						<StyledRow sx={{ mt: 0.75 }}>
							<GenderIcon gender={userData.gender} />
							<Typography
								variant="h5"
								sx={{
									ml: 0.75,
									maxWidth: '30rem',
									textAlign: 'right'
								}}
							>
								{userData.firstname} {userData.lastname},
							</Typography>
							<Typography
								variant="h5"
								sx={{
									ml: 0.75,
									textAlign: 'right'
								}}
							>
								{'28yo'}
							</Typography>
						</StyledRow>
						<Typography sx={{ mt: 0.75 }}>{'5 km away'}</Typography>
					</UserInfo>
				</Item>
			</StyledContainer>
		</>
	);
};

export default PublicProfile;
