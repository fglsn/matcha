import { useState } from 'react';
import { ImageType } from '../../types';
import { styled } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

const StyledContainer = styled('div')({
	height: '450px',
	width: '600px',
	margin: '0 auto'
});

const StyledBeforeIcon = styled(NavigateBeforeIcon)`
	position: absolute;
	top: 95%;
	left: 15px;
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
	top: 95%;
	right: 15px;
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

const Slide = styled('div')({
	width: '100%',
	height: '100%',
	backgroundPosition: 'center center',
	backgroundSize: 'contain',
	backgroundRepeat: 'no-repeat'
});

const Photos: React.FC<{ photos: ImageType[] }> = ({ photos }) => {
	const [currentIndex, setCurrentIndex] = useState<number>(0);

	const toPrevious = () => {
		const isFirstSlide = currentIndex === 0;
		const newIndex = isFirstSlide ? photos.length - 1 : currentIndex - 1;
		setCurrentIndex(newIndex);
	};

	const toNext = () => {
		const isLastSlide = currentIndex === photos.length - 1;
		const newIndex = isLastSlide ? 0 : currentIndex + 1;
		setCurrentIndex(newIndex);
	};

	return (
		<StyledContainer>
			<Slider>
				<StyledBeforeIcon color="primary" onClick={toPrevious} />
				<Slide
					style={{ backgroundImage: `url(${photos[currentIndex].dataURL}` }}
				/>
				<StyledNextIcon color="primary" onClick={toNext} />
			</Slider>
		</StyledContainer>
	);
};

export default Photos;
