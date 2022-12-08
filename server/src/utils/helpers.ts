import * as turf from '@turf/turf';
import { Coordinates } from '../types';

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

export const getDistance = (a: Coordinates, b: Coordinates) => {
	const from = turf.point([a.lon, a.lat]);
	const to = turf.point([b.lon, b.lat]);
	const distance = turf.distance(from, to);
	if (distance <= 2) return 2;
	return Math.ceil(distance);
};

export const assertNever = (value: string): never => {
    throw new Error(
      `Unhandled discriminated union member: ${value}`
    );
};