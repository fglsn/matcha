import axios from 'axios';
import { Coordinates } from '../types';

type ReverseLocationResponse = {
	data: SingleLocation[];
};

type SingleLocation = {
	neighbourhood?: string | null;
	locality?: string | null;
	country?: string | null;
};

export const getLocation = async (coordinates: Coordinates) => {
	try {
		const params = {
			access_key: process.env.API_KEY,
			query: `${coordinates.lat}, ${coordinates.lon}`
		};

		const response = await axios.get<ReverseLocationResponse>(`http://api.positionstack.com/v1/reverse`, { params });
		if (!response.data) {
			return '';
		}

		const location = response.data.data[0];
		const neighbourhood = location.neighbourhood ? `${location.neighbourhood}, ` : '';
		const city = location.locality ? `${location.locality}, ` : '';
		const country = location.country ? `${location.country}` : '';

		return neighbourhood + city + country;
	} catch (err) {
		console.log('Response err: ', err);
		return '';
	}
};
