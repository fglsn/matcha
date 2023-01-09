import { useState } from 'react';

export const useRangeSlider = (initialValue: number[], min: number, max: number) => {
	const [value, setValue] = useState(initialValue);
	
	const onChange = (event: Event, newValue: number | number[], activeThumb: number) => {
		if (!Array.isArray(newValue)) {
			return;
		}
		if (value[0] !== newValue[0] || value[1] !== newValue[1])
			setValue(newValue as number[]);
	};

	return {
		value,
		onChange,
		min,
		max,
		setValue
	};
};
