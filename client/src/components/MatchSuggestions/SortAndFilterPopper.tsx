//prettier-ignore
import { Popper, Box, ToggleButton, Paper, Grid, Slider, Typography, Checkbox, FormControlLabel, styled, ToggleButtonGroup, Button } from '@mui/material';
import { useRangeSlider } from '../../hooks/useRangeSlider';
import { useToggleButton } from '../../hooks/useToggleButton';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';

export const StyledPaper = styled(Paper)`
	display: flex;
	padding: 2.5rem;
	background-color: ##ffc600db;
	overflow-y: scroll;
	z-index: 2;
	position: initial;
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

const getMaxDistanceLabel = (value: number) => {
	if (value >= 200) return `${value}+ km`;
	return `${value} km`;
};

const getMaxAgeLabel = (value: number) => {
	if (value >= 65) return `${value}+ yo`;
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

	const distanceRangeSlider = useRangeSlider([2, 50], 2, 200);
	const ageRangeSlider = useRangeSlider([18, 65], 18, 65);
	const ratingRangeSlider = useRangeSlider([45, 100], 1, 100);
	const tagsRangeSlider = useRangeSlider([1, 5], 1, 5);

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
					<strong style={{ color: 'rgba(0, 0, 0, 0.6)' }}>Sort by</strong>
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
							style={{
								justifyContent: 'flex-end'
							}}
							label="Show sort results in reverse order"
							control={
								<Checkbox
									icon={<RadioButtonUncheckedIcon />}
									checkedIcon={<RadioButtonCheckedIcon />}
								/>
							}
						/>
					</Box>
					<Box
						sx={{
							flexDirection: 'column',
							padding: '1rem 1.5rem 1rem 1.5rem'
						}}
					>
						<strong style={{ color: 'rgba(0, 0, 0, 0.6)' }}>Filter by</strong>
						<div
							style={{
								textAlign: 'left',
								marginTop: 8
							}}
						>
							<Typography gutterBottom>Distance:</Typography>
							<Slider
								{...distanceRangeSlider}
								valueLabelDisplay="auto"
								disableSwap
								getAriaValueText={getMaxDistanceLabel}
								valueLabelFormat={getMaxDistanceLabel}
							/>
						</div>
						<div style={{ textAlign: 'left' }}>
							<Typography gutterBottom>Age:</Typography>
							<Slider
								{...ageRangeSlider}
								disableSwap
								valueLabelDisplay="auto"
								getAriaValueText={getMaxAgeLabel}
								valueLabelFormat={getMaxAgeLabel}
							/>
						</div>
						<div style={{ textAlign: 'left' }}>
							<Typography gutterBottom>Rating:</Typography>
							<Slider
								{...ratingRangeSlider}
								valueLabelDisplay="auto"
								disableSwap
							/>
						</div>
						<div style={{ textAlign: 'left' }}>
							<Typography gutterBottom>
								Number of common interests:
							</Typography>
							<Slider
								{...tagsRangeSlider}
								valueLabelDisplay="auto"
								disableSwap
							/>
						</div>
					</Box>
					<div
						style={{
							display: 'flex',
							justifyContent: 'flex-end'
						}}
					>
						<Button>Reset</Button>
						<Button>Sort & Filter</Button>
					</div>
				</Grid>
			</StyledPaper>
		</Popper>
	);
};

export default SortAndFilterPopper;
