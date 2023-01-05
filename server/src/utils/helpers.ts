import { Coordinates } from '../types';

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

export const getDistance = (a: Coordinates, b: Coordinates) => {
	let distance;

	if (a.lat === b.lat && a.lon === b.lon) return 2;

	const radlatA = (Math.PI * a.lat) / 180;
	const radlatB = (Math.PI * b.lat) / 180;
	const theta = a.lon - b.lon;
	const radTheta = (Math.PI * theta) / 180;

	distance = Math.sin(radlatA) * Math.sin(radlatB) + Math.cos(radlatA) * Math.cos(radlatB) * Math.cos(radTheta);
	if (distance > 1) distance = 1;

	distance = Math.acos(distance);
	distance = (distance * 180) / Math.PI;
	distance = distance * 60 * 1.1515 * 1.609344;

	if (distance <= 2) return 2;

	return Math.floor(distance);
};

export const assertNever = (value: string): never => {
	throw new Error(`Unhandled discriminated union member: ${value}`);
};
