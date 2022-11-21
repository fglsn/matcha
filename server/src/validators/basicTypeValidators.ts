import { ValidationError } from '../errors';
import { Gender, Orientation } from '../types';
import { Tags } from '../utils/tags';

const isString = (text: unknown): text is string => {
	return typeof text === 'string' || text instanceof String;
};

const isDate = (date: string): boolean => {
	return Boolean(Date.parse(date));
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isGender = (gender: any): gender is Gender => {
	return gender === 'male' || gender === 'female';
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isOrientation = (orientation: any): orientation is Orientation => {
	return orientation === 'straight' || orientation === 'gay' || orientation === 'bi';
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isTags = (tags: any): tags is string[] => {
	if (!Array.isArray(tags) || tags.length === 0 || tags.length > 5) throw new ValidationError(`Invalid tags format! Array of 1 to 5 tags expected`);
	for (let i = 0; i < tags.length; i++) {
		if (!isString(tags[i])) {
			throw new ValidationError(`Invalid tags format: tags must be strings`);
		}
		if (!Tags.find((t) => t === tags[i])) {
			throw new ValidationError(`Invalid tags format: tag '${tags[i]}' is not on the list`);
		}
	}
	return true;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isStringArray = (arr: any): arr is string[] => {
	if (!Array.isArray(arr)) return false;
	for (let i = 0; i < arr.length; i++) {
		if (!isString(arr[i])) {
			return false;
		}
	}
	return true;
};

// const isGender = (param: any): param is Gender => {
// 	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
// 	return Object.values(Gender).includes(param);
// };

export { isString, isDate, isGender, isOrientation, isTags, isStringArray };
