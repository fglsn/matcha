const isString = (text: unknown): text is string => {
	return typeof text === 'string' || text instanceof String;
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

export { isString, isDate, isStringArray };
