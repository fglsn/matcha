import { getAge } from '../utils/helpers';

test('returns age correctly', () => {
	const today = new Date();
	const diff = today.getFullYear() - 2022;
	expect(getAge('1994-01-01')).toBe(28 + diff);
});
