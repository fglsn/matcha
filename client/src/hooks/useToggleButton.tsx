import { useState } from 'react';

export const useToggleButton = (initialValue: string | undefined) => {
	const [value, setValue] = useState(initialValue);

	const onChange = (_event: React.MouseEvent<HTMLElement>, value: string) => {
		value && setValue(value);
	};
	return {
		value,
		onChange
	};
};

export const useToggleButtonWithSetValue = (initialValue: string) => {
	const [value, setValue] = useState(initialValue);
	const onChange = (_event: React.MouseEvent<HTMLElement>, value: string) => {
		value && setValue(value);
	};
	return {
		value,
		onChange,
		setValue
	};
};
