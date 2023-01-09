import { useContext } from 'react';
import { useNavigate } from 'react-router';
//prettier-ignore
import { blockProfile, dislikeProfile, likeProfile, unblockProfile } from '../../services/profile';
import { AlertContext } from '../AlertProvider';
import { useStateValue } from '../../state';
import { styled, Tooltip } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import FavoriteIcon from '@mui/icons-material/Favorite';

const StyledIconGroup = styled('div')({
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
	height: 10vw;
	width: 10vw;
	max-width: 70px;
	min-width: 45px;
	max-height: 70px;
	min-height: 45px;
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
	height: 13vw;
	width: 13vw;
	max-width: 80px;
	min-width: 45px;
	max-height: 80px;
	min-height: 45px;
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

const IconGroup: React.FC<{
	id: string | undefined;
	username: string;
	setIsMatch: React.Dispatch<React.SetStateAction<boolean>>;
	isLiked: boolean;
	setIsLiked: React.Dispatch<React.SetStateAction<boolean>>;
	isBlocked: boolean;
	setIsBlocked: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ id, username, setIsMatch, isLiked, setIsLiked, isBlocked, setIsBlocked }) => {
	const [{ loggedUser }] = useStateValue();
	const { success: successCallback, error: errorCallback } = useContext(AlertContext);
	const navigate = useNavigate();

	const putOrRemoveLike = async (id: string) => {
		try {
			if (!isLiked) {
				await likeProfile(id);
			} else {
				await dislikeProfile(id);
				setIsMatch(false);
			}
			setIsLiked(!isLiked);
		} catch (e) {
			errorCallback(e.message);
		}
	};

	const blockOrUnblockUser = async (id: string) => {
		try {
			if (!isBlocked) {
				await blockProfile(id);
				navigate('/');
			} else {
				await unblockProfile(id);
			}
			setIsBlocked(!isBlocked);
		} catch (e) {
			errorCallback(e.message);
		}
	};

	const handleLike = (event: any) => {
		event.preventDefault();
		if (!id) return;
		putOrRemoveLike(id);
	};

	const handleBlock = (event: any) => {
		event.preventDefault();
		if (!id) return;
		if (isLiked) {
			putOrRemoveLike(id);
			successCallback(`Like removed and ${username} won't appear in search again`);
		}
		blockOrUnblockUser(id);
	};

	return (
		<>
			{loggedUser?.id === id && (
				<StyledIconGroup>
					{' '}
					<Tooltip title="Cannot block your own profile" arrow placement="top">
						<IconWrapper>
							<StyledDislikeIcon color="disabled" />
						</IconWrapper>
					</Tooltip>
					<Tooltip title="Cannot like own profile" arrow placement="top">
						<IconWrapper>
							<StyledLikeIcon color="disabled" />
						</IconWrapper>
					</Tooltip>
				</StyledIconGroup>
			)}
			{loggedUser?.id !== id && (
				<StyledIconGroup>
					{isBlocked ? (
						<IconWrapperPressed onClick={handleBlock}>
							<StyledDislikeIcon color="secondary" />
						</IconWrapperPressed>
					) : (
						<Tooltip title="Pass / Block" arrow placement="top">
							<IconWrapper onClick={handleBlock}>
								<StyledDislikeIcon color="inherit" />
							</IconWrapper>
						</Tooltip>
					)}
					{isLiked ? (
						<Tooltip title="Unlike" arrow placement="top">
							<IconWrapperPressed onClick={handleLike}>
								<StyledLikeIcon color="secondary" />
							</IconWrapperPressed>
						</Tooltip>
					) : isBlocked ? (
						<Tooltip
							title="You blocked this account. Unblock first"
							arrow
							placement="top"
						>
							<IconWrapper>
								<StyledLikeIcon color="disabled" />
							</IconWrapper>
						</Tooltip>
					) : (
						<IconWrapper onClick={handleLike}>
							<StyledLikeIcon color="primary" />
						</IconWrapper>
					)}
				</StyledIconGroup>
			)}
		</>
	);
};

export default IconGroup;
