const isString = (text: unknown): text is string => {
	return typeof text === 'string' || text instanceof String;
};

const isDate = (date: string): boolean => {
	return Boolean(Date.parse(date));
};

// const isGender = (param: any): param is Gender => {
// 	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
// 	return Object.values(Gender).includes(param);
// };

export { isString, isDate };
