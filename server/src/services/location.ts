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

export const requestCoordinatesByIp = async (ipAddress: string | undefined): Promise<Coordinates> => {
	const defaultCoordinates: Coordinates = { lat: 60.16678195339881, lon: 24.941711425781254 }; //Hki city center as we are hki startup hehe
	if (!ipAddress) return defaultCoordinates;

	try {
		const response = await axios.get(`http://ip-api.com/json/${ipAddress}?fields=status,message,lat,lon`);

		const payload: unknown = response.data;
		let parsedPayload;
		if (payload && typeof payload === 'object' && 'lat' in payload && 'lon' in payload && 'status' in payload) {
			parsedPayload = payload as { lat: number; lon: number; status: string; message: string };
			console.log('parsed payload from IP API: ', parsedPayload); //rm later
		} else {
			parsedPayload = payload as { status: string; message: string }; //rm later
			console.log('parsed failed payload from IP API: ', parsedPayload); //rm later
			return defaultCoordinates;
		}

		if (parsedPayload.status === 'fail') console.log(`Location by ip response: ${parsedPayload.status}, message: ${parsedPayload.message}`); //rm later

		if (parsedPayload.status === 'success') {
			return { lat: parsedPayload.lat, lon: parsedPayload.lon };
		} else {
			console.log('Unexpected response from IP API (requestLocationByIp)', ipAddress, response.data);
			return defaultCoordinates;
		}
	} catch (err) {
		if (axios.isAxiosError(err)) console.log('Response err: ', err.response?.data); //rm later
		console.log(err); //rm later
		return defaultCoordinates;
	}
};

export const getLocation = async (coordinates: Coordinates) => {
	try {
		const params = {
			access_key: process.env.API_KEY,
			query: `${coordinates.lat}, ${coordinates.lon}`,
			limit: 1
		};

		const response = await axios.get<ReverseLocationResponse>(`http://api.positionstack.com/v1/reverse`, { params });
		if (!response.data) {
			return '';
		}
		// console.log(response.data);
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
