/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useContext, useEffect, useState } from 'react';
import { AlertContext } from '../components/AlertProvider';
import { logoutUser } from '../services/logout';
import { useStateValue } from '../state/state';
import { AuthError } from '../utils/errors';

export const useServiceCall = (
	serviceFn: () => Promise<any | undefined>,
	dependencies: any[]
) => {
	const [data, setData] = useState<any>();
	const [error, setError] = useState<any>();
	const [loading, setLoading] = useState<boolean>();
	const [, dispatch] = useStateValue();
	const { error: errorCallback } = useContext(AlertContext);

	const callback = useCallback(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const res = await serviceFn();
				setData(res);
				setLoading(false);
			} catch (err) {
				if (err instanceof AuthError) logoutUser(dispatch);
				setError(err);
				errorCallback(err.message);
				setLoading(false);
			}
		};
		fetchData();
	}, dependencies);

	useEffect(callback, dependencies);

	return { data, error, loading };
};
