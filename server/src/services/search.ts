import { getInitialMatchSuggestions, getUserDataByUserId } from '../repositories/userRepository';
import { ProfilePublic } from '../types';
import { getAge, getDistance } from '../utils/helpers';

export const getMatchSuggestions = async (userId: string) => {
	const requestorData = await getUserDataByUserId(userId);
	if (!requestorData) return [];

	const matchSuggestions = await getInitialMatchSuggestions(requestorData, {sort: 'age', order: 'desc'});

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

	// suggestedProfiles.sort((a, b) => a.distance - b.distance);

	//console.log(suggestedProfiles); //rm later
	return suggestedProfiles;
};
