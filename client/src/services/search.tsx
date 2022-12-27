import axios from 'axios';
import getAuthHeader from './auth';
import { handleAxiosError } from '../utils/errors';
import { apiBaseUrl } from '../constants';
import { SortAndFilter } from '../types';

export const getMatchSuggestions = async (sortAndFilter: SortAndFilter): Promise<any> => {
	const { distance, age, rating, tags } = sortAndFilter.filter;

	const sortAndFilterCriterias = {
		sort: sortAndFilter.sort,
		filter: [
			{ filter: 'distance', min: distance.min, max: distance.max },
			{ filter: 'age', min: age.min, max: age.max },
			{ filter: 'rating', min: rating.min, max: rating.max },
			{ filter: 'tags', min: tags.min, max: tags.max }
		]
	};

	try {
		const config = {
			headers: { Authorization: getAuthHeader() }
		};
		const response = await axios.post(
			`${apiBaseUrl}/users/match_suggestions`,
			sortAndFilterCriterias,
			config
		);
		return response.data;
	} catch (err) {
		handleAxiosError(err);
	}
};
