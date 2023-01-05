import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import { AlertContext } from './AlertProvider';
import accountService from '../services/profile';

const UpdateEmail = () => {
	const { success: successCallback, error: errorCallback } = useContext(AlertContext);
	const [searchParams] = useSearchParams();
	const updateToken = searchParams.get('update');
	const navigate = useNavigate();

	useEffect(() => {
		const validateUpdateToken = async () => {
			if (updateToken) {
				try {
					await accountService.updateEmailbyToken(updateToken);
					successCallback('Email was successfully updated!');
					navigate('/');
				} catch (err) {
					errorCallback('Invalid update link. Please try again.');
					navigate('/');
				}
			} else {
				navigate('/');
			}
		};
		validateUpdateToken();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return <></>;
};

export default UpdateEmail;
