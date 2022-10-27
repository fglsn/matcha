import { SetStateAction, useState } from 'react'

export const useField = (type: string, label: string) => {
	const [value, setValue] = useState('')

	const onChange = (event: { target: { value: SetStateAction<string> } }) => setValue(event.target.value)

	return {
		type,
		label,
		value,
		onChange,
	}
}

export const useFieldWithReset = (type: string, label: string) => {
	const [value, setValue] = useState('')

	const onChange = (event: { target: { value: SetStateAction<string> } }) => setValue(event.target.value)

	const reset = () => setValue('')

	return {
		type,
		label,
		value,
		onChange,
		reset
	}
}
