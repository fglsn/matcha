const isString = (text: unknown): text is string => {
	return typeof text === 'string' || text instanceof String;
};

const isNumber = (value: unknown): value is number => {
	return typeof value === 'number' || value instanceof Number;
};
const isDate = (date: string): boolean => {
	return Boolean(Date.parse(date));
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

const isStringRepresentedInteger = (string: unknown): string is string => {
	if (typeof string !== 'string') return false;
	const num = Number(string);
	if (!Number.isInteger(num)) return false;
	if (num <= 0) return false;
	return true;
};

export { isString, isNumber, isDate, isStringArray, isStringRepresentedInteger };
