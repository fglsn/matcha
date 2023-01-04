import axios from 'axios';
import getAuthHeader from './auth';
import { handleAxiosError } from '../utils/errors';
import { apiBaseUrl } from '../constants';
import { SortAndFilter, SortingCriteria } from '../types';

const getOrder = (value: string, reversed: boolean): SortingCriteria => {
	switch (value) {
		case 'distance':
			if (reversed) return { sort: 'distance', order: 'desc' };
			return { sort: 'distance', order: 'asc' };
		case 'age':
			if (reversed) return { sort: 'age', order: 'desc' };
			return { sort: 'age', order: 'asc' };
		case 'rating':
			if (reversed) return { sort: 'rating', order: 'asc' };
			return { sort: 'rating', order: 'desc' };
		case 'tags':
			if (reversed) return { sort: 'tags', order: 'asc' };
			return { sort: 'tags', order: 'desc' };
		default:
			return { sort: 'distance', order: 'asc' };
	}
};

const setDistanceRange = (min: number, max: number) => {
	if (max >= 142) return { min, max: undefined };
	return { min, max };
};

const setAgeRange = (min: number, max: number) => {
	if (max >= 80) return { min, max: undefined };
	return { min, max };
};

export const getMatchSuggestions = async (sortAndFilter: SortAndFilter, page: number, limit: number): Promise<any> => {
	const { sort, isReversedOrder } = sortAndFilter.sort;
	const { distance, age, rating, tags } = sortAndFilter.filter;
	const distanceRange = setDistanceRange(distance.min, distance.max);
	const ageRange = setAgeRange(age.min, age.max);
	const sortAndFilterCriterias = {
		sort: getOrder(sort, isReversedOrder),
		filter: [
			{ filter: 'distance', min: distanceRange.min, max: distanceRange.max },
			{ filter: 'age', min: ageRange.min, max: ageRange.max },
			{ filter: 'rating', min: rating.min, max: rating.max },
			{ filter: 'tags', min: tags.min, max: tags.max }
		]
	};

	try {
		const config = {
			headers: { Authorization: getAuthHeader() }
		};
		const response = await axios.post(
			`${apiBaseUrl}/users/match_suggestions?page=${page}&limit=${limit}`,
			sortAndFilterCriterias,
			config
		);
		return response.data;
	} catch (err) {
		handleAxiosError(err);
	}
};
