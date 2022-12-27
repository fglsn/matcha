import { useState } from 'react';

export const useToggleButton = (
	initialValue: string | undefined,
) => {
	const [value, setValue] = useState(initialValue);

	const onChange = (event: React.MouseEvent<HTMLElement>, value: string) => {
		value && setValue(value);
	}

	const reset = () => setValue(initialValue);

	return {
		value,
		onChange,
		reset
	}
};
