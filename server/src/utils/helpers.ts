export const convertUTCDateToLocalDate = (date: Date): Date => {
	const newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);

	const offset = date.getTimezoneOffset() / 60;
	const hours = date.getHours();

	newDate.setHours(hours - offset);

	return newDate;
};

export const findDublicates = (arr: string[]) => {
	return arr.filter((item, index) => arr.indexOf(item) !== index);
};

export const checkIfDublicatesExist = (arr: string[]) => {
	return new Set(arr).size !== arr.length;
};
