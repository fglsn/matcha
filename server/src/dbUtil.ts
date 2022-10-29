function getString(value: unknown): string {
	if (typeof value === 'string') {
		return value;
	}
	throw 'Expected value to be string, got: ' + value;
}

export {
	getString
};