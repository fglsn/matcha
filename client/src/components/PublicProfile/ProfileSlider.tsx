import { useState } from 'react';
import { ImageType, ProfilePublic } from '../../types';
import { Chip, Grid, styled, Typography } from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import OrientationIcon from './OrientationIcon';

const StyledContainer = styled('div')({
	width: '100vw',
	maxWidth: '600px',
	minWidth: '320px',
	height: 'calc(600px * (3/4))',
	maxHeight: 'calc(600px * (3/4))',
	minHeight: '320px',
	paddingBottom: '1rem',
	margin: '0 auto',
});

const StyledBeforeIcon = styled(NavigateBeforeIcon)`
	position: absolute;
	top: 93%;
	left: 5px;
	z-index: 1;
	cursor: pointer;
	border-radius: 28px;
	background-color: white !important;
	border: 1px solid #dcdcdc;
	&:hover {
		// box-shadow: 22px 23px #eeb902;
		transition: 0.2s ease;
		transform: scale(1.1);
	}
`;

const StyledNextIcon = styled(NavigateNextIcon)`
	position: absolute;
	top: 93%;
	right: 5px;
	z-index: 1;
	cursor: pointer;
	border-radius: 28px;
	background-color: white !important;
	border: 1px solid #dcdcdc;
	&:hover {
		transition: 0.2s ease;
		transform: scale(1.1);
	}
`;

const Slider = styled('div')({
	height: '100%',
	position: 'relative'
});

const Slide = styled('div')`
	display: flex;
	justify-content: center;
	height: 100%;
`;

const Photo = styled('img')`
	max-width: 100%;
	max-height: 100%;
	margin: auto;
	border-radius: 7px;
	object-fit: contain;
`;

const ProfileInfoWrapper = styled('div')`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
	margin: auto;
	padding: 2rem;
	text-align: center;
	border-radius: 7px;
	// background-color: #ffc60099;
	background-color: #ffc600db;
`;

export const ProfileInfo = ({ user }: { user: ProfilePublic }) => {
	return (
		<ProfileInfoWrapper>
			<Typography color="secondary">About {user.firstname}</Typography>
			<Typography
				sx={{
					typography: { sm: 'h5', xs: 'body2' },
					mt: 1.5,
					mb: 1,
					fontStyle: 'italic'
				}}
				color="secondary"
				// sx={{ mt: 1.5, mb: 1, fontStyle: 'italic' }}
				// variant="h5"
			>
				« {user.bio} »
			</Typography>
			<Typography
				color="secondary"
				sx={{
					typography: { sm: 'h6', xs: { fontSize: '0.9rem' } },
					m: 1,
					mb: 2,
					display: 'flex',
					fontSize: '1.1rem',
					alignItems: 'center'
				}}
			>
				Sexual preferenses:
				<OrientationIcon gender={user.gender} orientation={user.orientation} />
			</Typography>
			<Grid>
				{user.tags.map((tag: string) => {
					return (
						<Chip
							size="small"
							sx={{ m: 1, p: '10px' }}
							key={tag}
							color="secondary"
							label={tag}
						/>
					);
				})}
			</Grid>
		</ProfileInfoWrapper>
	);
};

const ProfileSlider: React.FC<{ photos: ImageType[]; user: ProfilePublic }> = ({
	photos,
	user
}) => {
	const [currentIndex, setCurrentIndex] = useState<number>(0);

	const toPrevious = () => {
		const isFirstSlide = currentIndex === 0;
		const newIndex = isFirstSlide ? photos.length : currentIndex - 1;
		setCurrentIndex(newIndex);
	};

	const toNext = () => {
		const isLastSlide = currentIndex === photos.length;
		const newIndex = isLastSlide ? 0 : currentIndex + 1;
		setCurrentIndex(newIndex);
	};

	// useMediaQuery((theme: any) => theme.breakpoints.up('sm'));
	return (
		<StyledContainer>
			<Slider>
				<StyledBeforeIcon color="primary" onClick={toPrevious} />
				<Slide>
					{currentIndex === photos.length ? (
						<ProfileInfo user={user} />
					) : (
						<Photo
							alt={`Profile pic by ${user.username}`}
							src={photos[currentIndex].dataURL}
						/>
					)}
				</Slide>
				<StyledNextIcon color="primary" onClick={toNext} />
			</Slider>
		</StyledContainer>
	);
};

export default ProfileSlider;
