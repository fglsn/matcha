//prettier-ignore
import { Popper, Box, ToggleButton, Paper, Grid, Slider, Typography, Checkbox, FormControlLabel, styled, ToggleButtonGroup, Button } from '@mui/material';
import { useRangeSlider } from '../../hooks/useRangeSlider';
import { useToggleButton } from '../../hooks/useToggleButton';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';

const StyledPaper = styled(Paper)`
	display: flex;
	padding: 2.5rem;
	background-color: ##ffc600db;
	overflow-y: scroll;
	z-index: 2;
	position: initial;
`;

const StyledSlider = styled(Slider)({
	color: 'primary',
	height: 3,
	width: '90%',
	textAlign: 'center',
	'& .MuiSlider-track': {
		border: 'none'
	},
	'& .MuiSlider-thumb': {
		height: 24,
		width: 24,
		backgroundColor: '#fff',
		border: '2px solid currentColor',
		'&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
			boxShadow: 'inherit'
		},
		'&:before': {
			display: 'none'
		}
	},
	'& .MuiSlider-valueLabel': {
		lineHeight: 1.2,
		fontSize: 12,
		background: 'unset',
		padding: 0,
		width: 44,
		height: 44,
		borderRadius: '50% 50% 50% 0',
		backgroundColor: '#ffc600',
		transformOrigin: 'bottom left',
		transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
		'&:before': { display: 'none' },
		'&.MuiSlider-valueLabelOpen': {
			transform: 'translate(50%, -100%) rotate(-45deg) scale(1)'
		},
		'& > *': {
			transform: 'rotate(45deg)'
		}
	}
});

export const SliderBox = styled(Box)`
	display: flex;
	border: 1px solid #a7a7a754;
	margin: 10px 0;
	padding: 23px 20px;
	border-radius: 9px;
	flex-direction: column;
	align-items: center;
`;

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
	'& .MuiToggleButtonGroup-grouped': {
		margin: '1rem 0.3rem 0.5rem  0.3rem',
		border: 3,
		'&.Mui-disabled': {
			border: 3
		},
		'&:not(:first-of-type)': {
			borderRadius: theme.shape.borderRadius
		},
		'&:first-of-type': {
			borderRadius: theme.shape.borderRadius
		}
	}
}));

const ActionTypeLabel = styled('div')`
	color: rgba(0, 0, 0, 0.6);
	text-align: left;
	font-weight: 600;
`;

const SliderLabel = styled(Typography)`
	margin-left: 15px;
	color: rgba(0, 0, 0, 0.5);
	font-weight: 500;
`;

const Filter = styled('div')`
	text-align: left;
	margin-top: 1rem;
`;

const getMaxDistanceLabel = (value: number) => {
	if (value >= 142) return `${value}+`;
	return `${value} km`;
};

const getMaxAgeLabel = (value: number) => {
	if (value >= 80) return `${value}+ yo`;
	return `${value} yo`;
};

const SortAndFilterPopper = ({
	id,
	open,
	anchorEl
}: {
	id: string | undefined;
	open: boolean;
	anchorEl: null | HTMLElement;
}) => {
	const sortBy = useToggleButton('distance');

	const { reset: resetDist, ...distanceRangeSlider } = useRangeSlider([2, 50], 2, 142);
	const { reset: resetAge, ...ageRangeSlider } = useRangeSlider([18, 80], 18, 80);
	const { reset: resetRat, ...ratingRangeSlider } = useRangeSlider([0, 100], 0, 100);
	const { reset: resetTags, ...tagsRangeSlider } = useRangeSlider([0, 5], 0, 5);

	const handleReset = () => {
		resetDist();
		resetAge();
		resetRat();
		resetTags();
	};

	return (
		<Popper
			id={id}
			open={open}
			anchorEl={anchorEl}
			disablePortal={true}
			placement="bottom-start"
			style={{ zIndex: '5' }}
			modifiers={[
				{
					name: 'preventOverflow',
					enabled: true,
					options: {
						altAxis: true,
						altBoundary: true,
						tether: true,
						rootBoundary: 'document',
						padding: 8,
						marginLeft: 8
					}
				}
			]}
		>
			<StyledPaper>
				<Grid item sm={'auto'} mt={1}>
					<ActionTypeLabel>Sort by</ActionTypeLabel>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column'
						}}
					>
						<StyledToggleButtonGroup exclusive {...sortBy}>
							<ToggleButton value="distance">DISTANCE</ToggleButton>
							<ToggleButton value="age">AGE</ToggleButton>
							<ToggleButton value="rating">RATING</ToggleButton>
							<ToggleButton value="tags">COMMON INTERESTS</ToggleButton>
						</StyledToggleButtonGroup>
						<FormControlLabel
							style={{ justifyContent: 'flex-end' }}
							label="Show sort results in reverse order"
							control={
								<Checkbox
									icon={<RadioButtonUncheckedIcon />}
									checkedIcon={<RadioButtonCheckedIcon />}
								/>
							}
						/>
					</Box>
					<Box sx={{ flexDirection: 'column' }}>
						<ActionTypeLabel>Filter by</ActionTypeLabel>
						<Filter>
							<SliderLabel>Distance</SliderLabel>
							<SliderBox>
								{distanceRangeSlider.value[1] ===
								distanceRangeSlider.value[0] ? (
									<Typography>
										{distanceRangeSlider.value[1] >= 142
											? `Over ${distanceRangeSlider.value[1]} km away`
											: `${distanceRangeSlider.value[1]} km away`}
									</Typography>
								) : (
									<Typography>
										{distanceRangeSlider.value[1] < 142
											? `Between ${distanceRangeSlider.value[0]} and ${distanceRangeSlider.value[1]} km away`
											: `From ${distanceRangeSlider.value[0]} to ∞ km away`}
									</Typography>
								)}
								<StyledSlider
									{...distanceRangeSlider}
									valueLabelDisplay="auto"
									disableSwap
									getAriaValueText={getMaxDistanceLabel}
									valueLabelFormat={getMaxDistanceLabel}
								/>
							</SliderBox>
						</Filter>
						<Filter>
							<SliderLabel>Age</SliderLabel>
							<SliderBox>
								{ageRangeSlider.value[1] === ageRangeSlider.value[0] ? (
									<Typography>
										{ageRangeSlider.value[1] >= 80
											? `Over ${ageRangeSlider.value[1]} years old`
											: `${ageRangeSlider.value[1]} years old`}
									</Typography>
								) : (
									<Typography gutterBottom>
										{ageRangeSlider.value[1] < 80
											? `Between ${ageRangeSlider.value[0]} and ${ageRangeSlider.value[1]}`
											: `From ${ageRangeSlider.value[0]} to ∞ years old`}
									</Typography>
								)}

								<StyledSlider
									{...ageRangeSlider}
									disableSwap
									valueLabelDisplay="auto"
									getAriaValueText={getMaxAgeLabel}
									valueLabelFormat={getMaxAgeLabel}
								/>
							</SliderBox>
						</Filter>
						<Filter>
							<SliderLabel>Rating</SliderLabel>
							<SliderBox>
								{ratingRangeSlider.value[1] ===
								ratingRangeSlider.value[0] ? (
									<Typography>
										{ratingRangeSlider.value[0]} points
									</Typography>
								) : (
									<Typography>
										Between {ratingRangeSlider.value[0]} and{' '}
										{ratingRangeSlider.value[1]}
									</Typography>
								)}
								<StyledSlider
									{...ratingRangeSlider}
									valueLabelDisplay="auto"
									disableSwap
								/>
							</SliderBox>
						</Filter>
						<Filter>
							<SliderLabel>Interests</SliderLabel>
							<SliderBox>
								{tagsRangeSlider.value[1] === tagsRangeSlider.value[0] ? (
									<Typography>
										{tagsRangeSlider.value[0]} tag(s) in common
									</Typography>
								) : (
									<Typography>
										Between {tagsRangeSlider.value[0]} and{' '}
										{tagsRangeSlider.value[1]} common tags
									</Typography>
								)}
								<StyledSlider
									{...tagsRangeSlider}
									valueLabelDisplay="auto"
									disableSwap
								/>
							</SliderBox>
						</Filter>
					</Box>
					<div
						style={{
							display: 'flex',
							justifyContent: 'flex-end'
						}}
					>
						<Button onClick={handleReset}>Reset</Button>
						<Button>Sort & Filter</Button>
					</div>
				</Grid>
			</StyledPaper>
		</Popper>
	);
};

export default SortAndFilterPopper;
