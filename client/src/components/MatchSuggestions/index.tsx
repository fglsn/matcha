//prettier-ignore
import { Alert, Box, Button, styled } from '@mui/material';
import { useState } from 'react';
import { useServiceCall } from '../../hooks/useServiceCall';
import { getMatchSuggestions } from '../../services/search';
import { useStateValue } from '../../state';
import { ProfilePublic } from '../../types';
import LoadingIcon from '../LoadingIcon';
import withProfileRequired from '../ProfileRequired';
import ClickAwayListener from '@mui/base/ClickAwayListener';
import SortAndFilterPopper from './SortAndFilterPopper';
import Profiles from './Profiles';

export const StyledMain = styled('div')`
	display: flex;
	flex-direction: column;
`;

const Main = () => {
	const [{ loggedUser }] = useStateValue();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

	const togglePopper = (event: React.MouseEvent<HTMLElement>) =>
		setAnchorEl(anchorEl ? null : event.currentTarget);

	const handleClickAway = () => setAnchorEl(null);

	const open = Boolean(anchorEl);
	const id = open ? 'popper' : undefined;

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
			<ClickAwayListener onClickAway={handleClickAway}>
				<Box>
					<Button onClick={togglePopper} style={{ width: '80%' }}>
						Sort & Filter
					</Button>
					{open ? (
						<SortAndFilterPopper id={id} open={open} anchorEl={anchorEl} />
					) : null}
				</Box>
			</ClickAwayListener>
			<Profiles matchSuggestionsData={matchSuggestionsData} />
		</StyledMain>
	);
};

export default withProfileRequired(Main);
