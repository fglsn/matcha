import { Alert, Container } from '@mui/material';
import { useState } from 'react';
import { useServiceCall } from '../hooks/useServiceCall';
import { getMatchSuggestions } from '../services/search';
import { useStateValue } from '../state';
import { ProfilePublic } from '../types';
import LoadingIcon from './LoadingIcon';
import withProfileRequired from './ProfileRequired';
import PublicProfile from './PublicProfile/PublicProfile';

const Main = () => {
	const [{ loggedUser }] = useStateValue();

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

	return <Profiles matchSuggestionsData={matchSuggestionsData} />;
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
