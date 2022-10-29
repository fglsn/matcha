function getString(value: unknown): string {
	if (typeof value === 'string') {
		return value;
	}
	throw `Expected value to be string, got: ${typeof value}`;
}

function getNumber(value: unknown): number {
	if (typeof value === 'number') {
		return value;
	}
	throw `Expected value to be number, got: ${typeof value}`;
}

function getBoolean(value: unknown): boolean {
	if (typeof value === 'boolean') {
		return value;
	}
	throw `Expected value to be boolean, got: ${typeof value}`;
}

export { getString, getNumber, getBoolean };
