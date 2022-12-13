// import { useEffect } from "react";
// import { setLoggedUser, useStateValue } from "../state";

import { Alert, Container } from '@mui/material';
import { useServiceCall } from '../hooks/useServiceCall';
import { getMatchSuggestions } from '../services/search';
import { useStateValue } from '../state';
import { ProfilePublic } from '../types';
import LoadingIcon from './LoadingIcon';
import withProfileRequired from './ProfileRequired';
// import PublicProfile from './PublicProfile';

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
		<Container sx={{ mt: 15, mb: 8 }}>
			{/* 
				here we can use PublicProfile component, but in order to do so we need to correct PublicProfile a bit (see comments in PublicProfile)
				currently PublicProfile is not accepting any props. we need to change it to get profileData as props.
				{matchSuggestionsData.map((profile) => {
				<>
					<PublicProfile profileData={profile}></PublicProfile>
				</>;
			})} */}
		</Container>
	);
};

export default withProfileRequired(Main);
