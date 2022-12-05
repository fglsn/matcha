import { styled, Alert, Container, Paper, Tooltip, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import {
	dislikeProfile,
	getLike,
	getPhotos,
	getPublicProfile,
	likeProfile
} from '../../services/profile';
import { useServiceCall } from '../../hooks/useServiceCall';
import { Images, Like, ProfilePublic } from '../../types';
import { useContext, useEffect, useState } from 'react';
import { AlertContext } from '../AlertProvider';
import EmojiFlagsIcon from '@mui/icons-material/EmojiFlags';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import ClearIcon from '@mui/icons-material/Clear';
import LoadingIcon from '../LoadingIcon';
import ProfileSlider from './ProfileSlider';
import withProfileRequired from '../ProfileRequired';
import { socket } from '../../services/socket';

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

const StyledReportButton = styled('div')`
	cursor: pointer;
	display: flex;
	align-items: baseline;
	font-size: 11px;
	text-align: left;
	// position: relative;
	// bottom: 10px;
	width: fit-content;
	color: #808080d4;
	border-bottom: 1px solid #80808070;
`;

const OnlineIndicator = ({ user_id }: {user_id: string}) => {
	
	const callback = (online: boolean) => {
		setOnline(online);
	}
	const [online, setOnline] = useState(false);
	// Query online status and listen for response
	useEffect(() => {
		console.log('uf');
		try {
			socket.emit('online_query', user_id, callback);
		} catch (err) {
			console.log(err);	
		}
		const intervalId = setInterval(() => {
			console.log('interval');
			try {
				socket.emit('online_query', user_id, callback);
			} catch (err) {
				console.log(err);	
			}
		}, 5000);
		return () => clearInterval(intervalId);
	}, [user_id]);

	return online ? (
		<div className="round-green">Online</div>
	) : (
		<div className="round-gray">Offline</div>
	);
};

const PublicProfile = () => {
	const { id } = useParams();
	const { success: successCallback, error: errorCallback } = useContext(AlertContext);
	const [isLiked, setIsLiked] = useState<boolean>(false);
	const [isBlocked, setIsBlocked] = useState<boolean>(false);
	const navigate = useNavigate();

	const {
		data: profileData,
		error: profileError
	}: { data: ProfilePublic | undefined; error: Error | undefined } = useServiceCall(
		async () => id && (await getPublicProfile(id)),
		[]
	);

	const {
		data: photosData,
		error: photosError
	}: { data: Images | undefined; error: Error | undefined } = useServiceCall(
		async () => id && (await getPhotos(id)),
		[]
	);

	const {
		data: likeData,
		error: likeError
	}: { data: Like | undefined; error: Error | undefined } = useServiceCall(
		async () => id && (await getLike(id)),
		[]
	);

	useEffect(() => {
		if (likeData !== undefined) {
			setIsLiked(likeData.like);
		}
	}, [likeData, setIsLiked]);

	if (profileError || photosError || likeError)
		return (
			<Alert severity="error">
				Error loading profile page, please try again...
			</Alert>
		);

	if (!profileData || !photosData || !likeData) return <LoadingIcon />;

	const like = async (id: string) => {
		try {
			await likeProfile(id);
			setIsLiked(!isLiked);
		} catch (e) {
			errorCallback(e.message);		
		}
	};

	const dislike = async (id: string) => {
		try {
			await dislikeProfile(id);
			setIsLiked(!isLiked);
		} catch (e) {
			errorCallback(e.message);
		}
	};
	const handleLike = (event: any) => {
		event.preventDefault();
		if (!id) return;
		if (!isLiked) {
			like(id);
		} else {
			dislike(id);
		}
	};

	const handleBlock = (event: any) => {
		event.preventDefault();
		setIsBlocked(true);
		if (isLiked) {
			setIsLiked(false);
			successCallback(
				`Like removed and ${profileData.username} won't appear again`
			);
		}
		navigate('/');
	};

	const handleReport = (event: any) => {
		event.preventDefault();
		//add confirmation pop up
		console.log('report fake account');
	};

	const GenderIcon: React.FC<{ gender: string }> = ({ gender }) => {
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
					<ProfileSlider photos={photosData.images} user={profileData} />
					<IconGroup>
						<Tooltip title="Pass / Block" arrow placement="top">
							{isBlocked ? (
								<IconWrapperPressed onClick={handleBlock}>
									<StyledDislikeIcon color="secondary" />
								</IconWrapperPressed>
							) : (
								<IconWrapper onClick={handleBlock}>
									<StyledDislikeIcon color="inherit" />
								</IconWrapper>
							)}
						</Tooltip>
						{isLiked ? (
							<Tooltip title="Unlike" arrow placement="top">
								<IconWrapperPressed onClick={handleLike}>
									<StyledLikeIcon color="secondary" />
								</IconWrapperPressed>
							</Tooltip>
						) : (
								<IconWrapper onClick={handleLike}>
									<StyledLikeIcon color="primary" />
								</IconWrapper>
						)}
					</IconGroup>
					<UserInfo>
						<Typography sx={{ mt: 2 }}>
							@{profileData.username.toLowerCase()}
						</Typography>
						<OnlineIndicator user_id={profileData.id} />
						<StyledRow sx={{ mt: 0.75 }}>
							<GenderIcon gender={profileData.gender} />
							<Typography
								variant="h5"
								noWrap
								sx={{
									ml: 0.75,
									maxWidth: 'fit-content',
									textAlign: 'right'
								}}
							>
								{profileData.firstname} {profileData.lastname},
							</Typography>

							<Typography
								variant="h5"
								sx={{
									ml: 0.75,
									textAlign: 'right'
								}}
							>
								{`${profileData.age}y.o.`}
							</Typography>
						</StyledRow>
						<Typography sx={{ mt: 0.75 }}>
							{profileData.distance} km away
						</Typography>
					</UserInfo>
					<StyledReportButton onClick={handleReport}>
						<EmojiFlagsIcon
							style={{ height: '10px', width: '10px', marginRight: 3 }}
						/>
						Report fake account
					</StyledReportButton>
				</Item>
			</StyledContainer>
		</>
	);
};

export default withProfileRequired(PublicProfile);
