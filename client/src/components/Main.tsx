import { Alert, Container } from '@mui/material';
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

	return (
		<Container sx={{ mt: 5, mb: 8 }}>
			{matchSuggestionsData.map((profile, key) => (
				<PublicProfile profileData={profile} key={key}/>
			))}
		</Container>
	);
};

export default withProfileRequired(Main);
