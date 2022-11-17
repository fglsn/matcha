import { Gender, Orientation } from '../types';

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

// const isGender = (param: any): param is Gender => {
// 	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
// 	return Object.values(Gender).includes(param);
// };

export { isString, isDate, isGender, isOrientation };
