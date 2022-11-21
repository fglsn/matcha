/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from 'react';

export const useServiceCall = (serviceFn: () => Promise<any | undefined>, dependencies: any[]) => {
	const [data, setData] = useState<any>();
	const [error, setError] = useState<any>();
	const [loading, setLoading] = useState<boolean>();

	const callback = useCallback(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const res = await serviceFn();
				setData(res);
				setLoading(false);
			} catch (err) {
				setError(err);
				setLoading(false);
			}
		};
		fetchData();
	}, dependencies);

	useEffect(callback, dependencies);

	return { data, error, loading };
};
