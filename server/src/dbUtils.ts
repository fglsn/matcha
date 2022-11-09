function getString(value: unknown): string {
	if (typeof value === 'string') {
		return value;
	}
	throw `Expected value to be string, got: ${typeof value}`;
}

function getStringOrUndefined(value: unknown): string | undefined {
	if (typeof value === 'string') {
		return value;
	}
	if (value === null) {
		return undefined;
	}
	throw `Expected value to be string or null, got: ${typeof value}`;
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

const getDate = (value: unknown): Date => {
	if (value instanceof Date) {
		return value;
	}
	throw `Expected value to be date, got: ${typeof value}`;
};

const getDateOrUndefined = (value: unknown): Date | undefined => {
	if (value instanceof Date) {
		return value;
	}
	if (value === null) {
		return undefined;
	}
	throw `Expected value to be date, got: ${typeof value}`;
};

export { getString, getStringOrUndefined, getNumber, getBoolean, getDate, getDateOrUndefined };
