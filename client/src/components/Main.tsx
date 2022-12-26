//prettier-ignore
import { Alert, Box, ToggleButtonGroup, ToggleButton, Button, Container, Popper, styled, Paper, Grid, Slider, Typography } from '@mui/material';
import { useState } from 'react';
import { useServiceCall } from '../hooks/useServiceCall';
import { useToggleButton } from '../hooks/useToggleButton';
import { useRangeSlider } from '../hooks/useRangeSlider';
import { getMatchSuggestions } from '../services/search';
import { useStateValue } from '../state';
import { ProfilePublic } from '../types';
import LoadingIcon from './LoadingIcon';
import withProfileRequired from './ProfileRequired';
import PublicProfile from './PublicProfile/PublicProfile';

export const StyledMain= styled('div')`
	display: flex;
	flex-direction: column;
`;

export const StyledPaper = styled(Paper)`
	display: flex;
	padding: 1.5rem;
	background-color: ##ffc600db;
	overflow-y: scroll;
	z-index: 2;
	position: initial;
`;

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
	'& .MuiToggleButtonGroup-grouped': {
		margin: theme.spacing(0.5),
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

const Main = () => {
	const [{ loggedUser }] = useStateValue();

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

	const togglePopper = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(anchorEl ? null : event.currentTarget);
	};

	const open = Boolean(anchorEl);
	const id = open ? 'popper' : undefined;

	const sortBy = useToggleButton('distance');

	const distanceRangeSlider = useRangeSlider([2, 50], 2, 200);
	const ageRangeSlider = useRangeSlider([18, 65], 18, 65);
	const ratingRangeSlider = useRangeSlider([45, 100], 1, 100);
	const tagsRangeSlider = useRangeSlider([1, 5], 1, 5);

	const {
		data: matchSuggestionsData,
		error: matchSuggestionsError
	}: {
		data: ProfilePublic[];
		error: Error | undefined;
	} = useServiceCall(async () => loggedUser && (await getMatchSuggestions()), []);

	if (matchSuggestionsError)
		return <Alert severity="error">Error loading page, please try again...</Alert>;

	if (!matchSuggestionsData) {
		return <LoadingIcon />;
	}

	return (
		<StyledMain>
			<Button onClick={togglePopper} aria-describedby={id}>
				Sort & Filter
			</Button>
			<Popper
				id={id}
				open={open}
				anchorEl={anchorEl}
				placement="bottom-start"
				disablePortal={true}
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
							padding: 8
						}
					}
				]}
			>
				<StyledPaper>
					<Grid item sm={'auto'} mt={1}>
						<strong>Sort by</strong>
						<Box sx={{ flexDirection: 'column' }}>
							<StyledToggleButtonGroup exclusive {...sortBy}>
								<ToggleButton value="distance">DISTANCE</ToggleButton>
								<ToggleButton value="age">AGE</ToggleButton>
								<ToggleButton value="rating">RATING</ToggleButton>
								<ToggleButton value="tags">COMMON INTERESTS</ToggleButton>
							</StyledToggleButtonGroup>
						</Box>
						<Box sx={{ flexDirection: 'column' }}>
							<strong>Filter by</strong>
							<div>
								<Typography gutterBottom>Distance:</Typography>
								<Slider
									{...distanceRangeSlider}
									valueLabelDisplay="auto"
									disableSwap
									getAriaValueText={getMaxDistanceLabel}
									valueLabelFormat={getMaxDistanceLabel}
								/>
							</div>
							<div>
								<Typography gutterBottom>Age:</Typography>
								<Slider
									{...ageRangeSlider}
									disableSwap
									valueLabelDisplay="auto"
									getAriaValueText={getMaxAgeLabel}
									valueLabelFormat={getMaxAgeLabel}
								/>
							</div>
							<div>
								<Typography gutterBottom>Rating:</Typography>
								<Slider
									{...ratingRangeSlider}
									valueLabelDisplay="auto"
									disableSwap
								/>
							</div>
							<div>
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
					</Grid>
				</StyledPaper>
			</Popper>
			<Profiles matchSuggestionsData={matchSuggestionsData} />
		</StyledMain>
	);
};

const Profiles = ({
	matchSuggestionsData
}: {
	matchSuggestionsData: ProfilePublic[];
}) => {
	const [currentMatchSuggestionsData, setCurrentMatchSuggestionsData] =
		useState(matchSuggestionsData);

	const handleAction = (profile: ProfilePublic) => {
		setCurrentMatchSuggestionsData(
			currentMatchSuggestionsData.filter((p) => p.id !== profile.id)
		);
	};

	return (
		<Container sx={{ mt: 5, mb: 8 }}>
			{currentMatchSuggestionsData.map((profile) => (
				<PublicProfile
					profileData={profile}
					key={profile.id}
					onAction={handleAction}
				/>
			))}
		</Container>
	);
};

export default withProfileRequired(Main);
