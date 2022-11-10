import { useEffect, useState } from 'react';

export const useServiceCall = (serviceFn: () => Promise<any>) => {

	const [data, setData] = useState<any>();
	const [error, setError] = useState<any>();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await serviceFn();
				setData(res);
			} catch (err) {
				setError(err);
			}
		}
		fetchData();
	}, [serviceFn]);

	return { data, error };
};
