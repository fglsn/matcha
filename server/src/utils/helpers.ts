import * as turf from '@turf/turf';
import { UserData } from '../types';

export const convertUTCDateToLocalDate = (date: Date): Date => {
	const newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);

	const offset = date.getTimezoneOffset() / 60;
	const hours = date.getHours();

	newDate.setHours(hours - offset);

	return newDate;
};

export const findDuplicates = (arr: string[]) => {
	return arr.filter((item, index) => arr.indexOf(item) !== index);
};

export const checkIfDuplicatesExist = (arr: string[]) => {
	return new Set(arr).size !== arr.length;
};

//might fail when offfset back by local if not same timezone as front
export const getAge = (dateString: string): number => {
	const today = new Date();
	const birthDate = new Date(dateString);
	let age = today.getFullYear() - birthDate.getFullYear();
	const m = today.getMonth() - birthDate.getMonth();
	if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
		age--;
	}
	return age;
};

export const getDistance = (a: UserData, b: UserData) => {
	console.log(a.coordinates.lon, a.coordinates.lat);
	console.log(b.coordinates.lon, b.coordinates.lat);
	
	const from = turf.point([a.coordinates.lon, a.coordinates.lat]);
	const to = turf.point([b.coordinates.lon, b.coordinates.lat]);
	const distance = turf.distance(from, to);
	console.log('distnace:%d', distance);
	return distance;
};
