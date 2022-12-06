import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
//prettier-ignore
import { getBlockStatus, getLikeAndMatchStatus, getPhotos, getPublicProfile } from '../../services/profile';
import { styled, Alert, Container, Paper, Typography } from '@mui/material';
import { Images, LikeAndMatchStatus, ProfilePublic } from '../../types';
import { useServiceCall } from '../../hooks/useServiceCall';
import withProfileRequired from '../ProfileRequired';
import ProfileSlider from './ProfileSlider';
import ReportDialog from './ReportDialog';
import LoadingIcon from '../LoadingIcon';
import GenderIcon from './GenderIcon';
import IconGroup from './IconGroup';
import { OnlineIndicator } from './OnlineIndicator';

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

const StyledAlert = styled(Alert)`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	margin: 15px 0;
`;

const StyledLink = styled(Link)`
	color: #ffc600;
	text-decoration: none;
`;

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
					<ReportDialog id={id} username={profileData.username} />
				</Item>
			</StyledContainer>
		</>
	);
};

export default withProfileRequired(PublicProfile);
