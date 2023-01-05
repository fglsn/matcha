import { getDistance } from '../utils/helpers';

test('returns 2 when distance less than 2', () => {
	const result = getDistance({ lat: 0, lon: 0 }, { lat: 0, lon: 0 });
	expect(result).toEqual(2);
});

test('returns consistent value', () => {
	const result = getDistance({ lat: 60.16218735562509, lon: 24.905147552490238 }, { lat: 0, lon: 0 });
	const second = getDistance({ lat: 60.16218735562509, lon: 24.905147552490238 }, { lat: 0, lon: 0 });

	const third = getDistance({ lat: 60.16218735562509, lon: 24.905147552490238 }, { lat: 0, lon: 0 });

	expect(result).toBe(7024);
	expect(second).toBe(7024);
	expect(third).toBe(7024);
});

test('works with negative', () => {
	const result = getDistance({ lat: -60.16218735562509, lon: -24.905147552490238 }, { lat: 0, lon: 0 });
	expect(result).toEqual(7024);
});
