import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { socket } from '../../services/socket';
//prettier-ignore
import { getBlockStatus, getLikeAndMatchStatus, getPhotos, getPublicProfile } from '../../services/profile';
import { styled, Alert, Container, Paper, Typography } from '@mui/material';
import { Images, LikeAndMatchStatus, ProfilePublic } from '../../types';
import { useServiceCall } from '../../hooks/useServiceCall';
import EmojiFlagsIcon from '@mui/icons-material/EmojiFlags';
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import withProfileRequired from '../ProfileRequired';
import ProfileSlider from './ProfileSlider';
import LoadingIcon from '../LoadingIcon';
import IconGroup from './IconGroup';

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

const StyledAlert = styled(Alert)`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	margin: 15px 0;
`;

const StyledLink = styled(Link)`
	color: #ff9800;
	text-decoration: none;
`;

const OnlineIndicator = ({ user_id }: { user_id: string }) => {
	const callback = (online: boolean) => {
		setOnline(online);
	};
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
	const [isLiked, setIsLiked] = useState<boolean>(false);
	const [isBlocked, setIsBlocked] = useState<boolean>(false);
	const [isMatch, setIsMatch] = useState<boolean>(false);

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
		data: likeAndMatchStatusData,
		error: likeAndMatchStatusError
	}: { data: LikeAndMatchStatus | undefined; error: Error | undefined } =
		useServiceCall(async () => id && (await getLikeAndMatchStatus(id)), [isLiked]);

	const {
		data: blockStatusData,
		error: blockStatusError
	}: { data: { block: boolean } | undefined; error: Error | undefined } =
		useServiceCall(async () => id && (await getBlockStatus(id)), [isBlocked]);

	useEffect(() => {
		if (likeAndMatchStatusData !== undefined) {
			setIsLiked(likeAndMatchStatusData.like);
			setIsMatch(likeAndMatchStatusData.match);
		}
		if (blockStatusData !== undefined) {
			setIsBlocked(blockStatusData.block);
		}
	}, [blockStatusData, likeAndMatchStatusData, setIsLiked, setIsMatch]);

	if (profileError || photosError || likeAndMatchStatusError || blockStatusError)
		return (
			<Alert severity="error">
				Error loading profile page, please try again...
			</Alert>
		);

	if (!profileData || !photosData || !likeAndMatchStatusData || !blockStatusData) {
		return <LoadingIcon />;
	}

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
					{isMatch && (
						<StyledAlert severity="info" color="warning">
							<Typography variant="h6">
								You have a match!{' '}
								<StyledLink to={`/profile/chat`}>Open Chat</StyledLink>
							</Typography>
						</StyledAlert>
					)}

					<ProfileSlider photos={photosData.images} user={profileData} />
					<IconGroup
						id={id}
						username={profileData.username}
						setIsMatch={setIsMatch}
						isLiked={isLiked}
						setIsLiked={setIsLiked}
						isBlocked={isBlocked}
						setIsBlocked={setIsBlocked}
					/>
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
