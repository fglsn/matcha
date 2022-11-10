import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useServiceCall } from '../../hooks/useServiceCall';
import { getProfilePage } from '../../services/profile';
import { logoutUser } from '../../services/logout';
import { useStateValue } from '../../state';
import { AuthError } from '../../utils/errors';
import { UserData } from '../../types';
import { AlertContext } from '../AlertProvider';
import withAuthRequired from '../AuthRequired';
import LoadingIcon from '../LoadingIcon';
import Alert from '@mui/material/Alert';

const Profile = () => {
	const { error: errorCallback } = useContext(AlertContext);

	const { data, error }: { data: UserData | undefined; error: Error | undefined } = useServiceCall(getProfilePage);

	const [, dispatch] = useStateValue();
	const navigate = useNavigate();

	// to be changed
	window.onblur = function () {
		window.onfocus = function () {
			// eslint-disable-next-line no-restricted-globals
			location.reload();
		};
	};

	useEffect(() => {
		if (error) {
			if (error instanceof AuthError) {
				logoutUser(dispatch);
				errorCallback(error.message);
				navigate('/login');
			}
		}
	}, [dispatch, error, errorCallback, navigate]);

	if (error) return <Alert severity="error">Error Loading Profile...</Alert>;

	if (!data) return <LoadingIcon />;

	//render form sections
	return <div>hello {data.username}</div>;
};

export default withAuthRequired(Profile);
