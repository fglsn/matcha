import { Container } from "@mui/material";
import { useState } from "react";
import { ProfilePublic } from "../../types";
import PublicProfile from '../PublicProfile/PublicProfile';

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
		<Container sx={{ mb: 5 }}>
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

export default Profiles;