//prettier-ignore
import { FilterCriteriaInternal, ProfilePublic, SortAndFilter, SortingCriteriaInternal } from '../../types';
//prettier-ignore
import { Alert, Box, Button, Container, styled } from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useStateValue } from '../../state';
import { useServiceCall } from '../../hooks/useServiceCall';
import { getMatchSuggestions } from '../../services/search';
import ClickAwayListener from '@mui/base/ClickAwayListener';
import PublicProfile from '../PublicProfile/PublicProfile';
import SortAndFilterPopper from './SortAndFilterPopper';
import withProfileRequired from '../ProfileRequired';
import LoadingIcon from '../LoadingIcon';

export const StyledMain = styled('div')`
	display: flex;
	flex-direction: column;
`;

const defaultSortCriteria: SortingCriteriaInternal = {
	sort: 'distance',
	isReversedOrder: false
};

const defaultFilterCriteria: FilterCriteriaInternal = {
	distance: { min: 2, max: 50 },
	age: { min: 18, max: 80 },
	rating: { min: 0, max: 100 },
	tags: { min: 0, max: 5 }
};

const MatchSuggestions = () => {
	const [{ loggedUser }] = useStateValue();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [sortAndFilter, setSortAndFilter] = useState<SortAndFilter>({
		sort: defaultSortCriteria,
		filter: defaultFilterCriteria
	});
	const [filteredIds, setFilteredIds] = useState<string[]>([]);
	const [profiles, setProfiles] = useState<ProfilePublic[]>([]);
	const [pageNumber, setPageNumber] = useState(1);
	const [hasMore, setHasMore] = useState(true);

	const togglePopper = (event: React.MouseEvent<HTMLElement>) =>
		setAnchorEl(anchorEl ? null : event.currentTarget);

	const handleClickAway = () => setAnchorEl(null);

	const open = Boolean(anchorEl);
	const id = open ? 'popper' : undefined;

	const {
		data: matchSuggestionsData,
		error: matchSuggestionsError,
		loading: isLoading
	}: {
		data: ProfilePublic[];
		error: Error | undefined;
		loading: boolean;
	} = useServiceCall(
		async () =>
			loggedUser && (await getMatchSuggestions(sortAndFilter, pageNumber, 4)),
		[sortAndFilter, pageNumber]
	);

	const handleOnChange = (newSortAndFilter: SortAndFilter) => {
		setPageNumber(1);
		setFilteredIds([]);
		setSortAndFilter(newSortAndFilter);
		setProfiles([]);
	};

	const observer = useRef<IntersectionObserver | null>(null);
	const lastDisplayedProfileRef = useCallback(
		(node) => {
			if (isLoading) return;
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && hasMore) {
					setPageNumber((prevPageNumber) => prevPageNumber + 1);
				}
			});
			if (node) observer.current.observe(node);
		},
		[isLoading, hasMore]
	);

	useEffect(() => {
		if (matchSuggestionsData) {
			if (matchSuggestionsData.length === 0) {
				setHasMore(false);
			} else {
				setProfiles((prevProfiles) => {
					return [...new Set([...prevProfiles, ...matchSuggestionsData])];
				});
				setHasMore(matchSuggestionsData.length > 0);
			}
		}
	}, [matchSuggestionsData, setProfiles]);

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
						<SortAndFilterPopper
							id={id}
							open={open}
							anchorEl={anchorEl}
							sortAndFilter={sortAndFilter}
							handleOnChange={handleOnChange}
						/>
					) : null}
				</Box>
			</ClickAwayListener>
			<Container sx={{ mb: 5 }}>
				{profiles
					.filter((profile) => filteredIds.indexOf(profile.id) < 0)
					.map((profile, i) => (
						<Box
							key={i}
							{...(profiles.length === i + 1
								? { ref: lastDisplayedProfileRef }
								: {})}
						>
							<PublicProfile
								profileData={profile}
								onAction={(p) => setFilteredIds([...filteredIds, p.id])}
							/>
						</Box>
					))}
			</Container>
		</StyledMain>
	);
};

export default withProfileRequired(MatchSuggestions);
