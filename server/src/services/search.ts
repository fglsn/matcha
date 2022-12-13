import { getInitialMatchSuggestions, getUserDataByUserId } from '../repositories/userRepository';
import { Gender, Orientation, ProfilePublic } from '../types';
import { getAge, getDistance } from '../utils/helpers';

export const getInitialMatchSuggestionsIds = async (userId: string) => {
	const requestorData = await getUserDataByUserId(userId);
	if (!requestorData) return [];

	const matchSuggestions = await getInitialMatchSuggestions(userId, requestorData.gender as Gender, requestorData.orientation as Orientation);

	const suggestedProfiles: ProfilePublic[] = matchSuggestions.map((profile) => {
		const distance = getDistance(requestorData.coordinates, profile.coordinates);
		const age = getAge(String(profile.birthday));

		return {
			id: profile.id,
			username: profile.username,
			firstname: profile.firstname,
			lastname: profile.lastname,
			age: age,
			gender: profile.gender as string,
			orientation: profile.orientation as string,
			bio: profile.bio as string,
			tags: profile.tags as string[],
			distance: distance,
			location: profile.location,
			fameRating: profile.fameRating
		};
	});

	console.log(suggestedProfiles);
	return suggestedProfiles;
};