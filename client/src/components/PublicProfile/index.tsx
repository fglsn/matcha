import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
//prettier-ignore
import { getBlockStatus, getLikeAndMatchStatus, getPhotos } from '../../services/profile';
import { styled, Alert, Container, Paper, Typography } from '@mui/material';
import { Images, LikeAndMatchStatus, ProfilePublic } from '../../types';
import { useServiceCall } from '../../hooks/useServiceCall';
import FameRating from '../ProfileEditor/FameRating';
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
	color: theme.palette.text.secondary,
	maxWidth: '100%'
}));

const StyledContainer = styled(Container)({
	maxWidth: '100%',
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

const SpaceBetween = styled('div')`
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: space-between;

`;

const PublicProfile = ({
	profileData,
	onAction
}: {
	profileData: ProfilePublic;
	onAction?: (profile: ProfilePublic) => void;
}) => {
	const [isLiked, setIsLiked] = useState<boolean>(false);
	const [isBlocked, setIsBlocked] = useState<boolean>(false);
	const [isMatch, setIsMatch] = useState<boolean>(false);
	const id = profileData.id;

	const {
		data: photosData,
		error: photosError
	}: { data: Images | undefined; error: Error | undefined } = useServiceCall(
		async () => id && (await getPhotos(id)),
		[id]
	);

	const {
		data: likeAndMatchStatusData,
		error: likeAndMatchStatusError
	}: { data: LikeAndMatchStatus | undefined; error: Error | undefined } = useServiceCall(
		async () => id && (await getLikeAndMatchStatus(id)),
		[isLiked, id]
	);

	const {
		data: blockStatusData,
		error: blockStatusError
	}: { data: { block: boolean } | undefined; error: Error | undefined } = useServiceCall(
		async () => id && (await getBlockStatus(id)),
		[isBlocked, id]
	);

	useEffect(() => {
		if (likeAndMatchStatusData !== undefined) {
			setIsLiked(likeAndMatchStatusData.like);
			setIsMatch(likeAndMatchStatusData.match);
		}
		if (blockStatusData !== undefined) {
			setIsBlocked(blockStatusData.block);
		}
	}, [blockStatusData, likeAndMatchStatusData, setIsLiked, setIsMatch]);

	if (photosError || likeAndMatchStatusError || blockStatusError)
		return <Alert severity="error">Error loading profile page, please try again...</Alert>;

	if (!photosData || !likeAndMatchStatusData || !blockStatusData) {
		return <LoadingIcon />;
	}

	return (
		<StyledContainer className='pubStyledContainer' sx={{ mt: 4, mb: 8 }}>
			<Item className='pubItem' >
				{isMatch && (
					<StyledAlert severity="info" color="warning">
						<Typography variant="h6">
							You have a match!{' '}
							<StyledLink to={`/chats/${likeAndMatchStatusData.matchId}`}>
								Open Chat
							</StyledLink>
						</Typography>
					</StyledAlert>
				)}
				<SpaceBetween>
					<FameRating fameRating={profileData.fameRating} />
					<Typography>
						<Link
							style={{ textDecoration: 'none', color: 'inherit' }}
							to={`/profile/${profileData.id}`}
						>
							@{profileData.username.toLowerCase()}
						</Link>
					</Typography>
				</SpaceBetween>
				<ProfileSlider photos={photosData.images} user={profileData} />
				<IconGroup
					id={id}
					username={profileData.username}
					setIsMatch={(value) => {
						setIsMatch(value);
					}}
					isLiked={isLiked}
					setIsLiked={setIsLiked}
					isBlocked={isBlocked}
					setIsBlocked={(value) => {
						onAction && onAction(profileData);
						setIsBlocked(value);
					}}
				/>
				<UserInfo sx={{ mt: 3 }}>
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
							{profileData.age}
						</Typography>
					</StyledRow>
					<Typography sx={{ mt: 0.75 }}>{profileData.distance} km away</Typography>
				</UserInfo>
				<ReportDialog
					id={id}
					username={profileData.username}
					setIsBlocked={(value) => {
						onAction && onAction(profileData);
						setIsBlocked(value);
					}}
				/>
			</Item>
		</StyledContainer>
	);
};

export default withProfileRequired(PublicProfile);
