import { useState } from 'react';
import { ImageType } from '../../types';
import { Chip, Grid, styled, Typography } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import TransgenderIcon from '@mui/icons-material/Transgender';
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';

const StyledContainer = styled('div')({
	height: '450px',
	width: '600px',
	margin: '0 auto'
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
	object-fit: scale-down;
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

export const ProfileInfo = ({ user }: any) => {
	//any will be changed late to according type
	const OrientationIcon = ({
		orientation,
		gender
	}: {
		orientation: string | undefined;
		gender: string | undefined;
	}) => {
		//remove undefined
		switch (orientation) {
			case 'straight':
				if (gender === 'male') return <FemaleIcon color='secondary'/>;
				if (gender === 'female') return <MaleIcon color="secondary" />;
				return <></>;
			case 'gay':
				if (gender === 'male') return <MaleIcon color="secondary" />;
				if (gender === 'female') return <FemaleIcon color="secondary" />;
				return <></>;
			case 'bi':
				return <TransgenderIcon color="secondary" />;
			default:
				return <></>;
		}
	};
	return (
		<ProfileInfoWrapper>
			<Typography color="secondary">About {user.firstname}</Typography>
			<Typography color="secondary" sx={{ mt: 1.5, mb: 1.5 }} variant="h5">
				« {user.bio} »
			</Typography>
			<Grid>
				{user.tags.map((tag: string) => {
					return (
						<Chip
							size="small"
							sx={{ m: 1, p: '15px' }}
							key={tag}
							color="secondary"
							label={tag}
						/>
					);
				})}
			</Grid>
			<Typography color="secondary" sx={{ m: 1 }}>
				Sexual preferenses
			</Typography>
			<OrientationIcon gender={user.gender} orientation={user.orientation} />
		</ProfileInfoWrapper>
	);
};

const ProfileSlider: React.FC<{ photos: ImageType[]; user: any }> = ({
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
