import { useState } from 'react';

export const useRangeSlider = (
	initialValue: number[] | undefined,
	min: number,
	max: number
) => {
	const [value, setValue] = useState(initialValue);
	const minRange = 1;

	const onChange = (event: Event, newValue: number | number[], activeThumb: number) => {
		if (!Array.isArray(newValue)) {
			return;
		}

		if (newValue[1] - newValue[0] < minRange) {
			if (activeThumb === 0) {
				const clamped = Math.min(newValue[0], max - minRange);
				setValue([clamped, clamped + minRange]);
			} else {
				const clamped = Math.max(newValue[1], minRange);
				setValue([clamped - minRange, clamped]);
			}
		} else {
			setValue(newValue as number[]);
		}
	};

	return {
		value,
		onChange,
		min,
		max
	};
};
