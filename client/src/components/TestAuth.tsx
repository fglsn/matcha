import { Box } from '@mui/material';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';
import testAuthService from '../services/testAuth';
import { AlertContext } from './AlertProvider';
import withAuthRequired from './AuthRequired';

const TestAuth = () => { //rm later
	const alert = useContext(AlertContext);
	const navigate = useNavigate();

	useEffect(() => {
		const accessTestPage = async () => {
			try {
				await testAuthService.testGetProtectedPage();
				console.log('User valid');
			} catch (err) {
				console.log(err);
				//alert.error(err);
				// navigate('/login');
			}
		};
		accessTestPage();
	}, [alert, navigate]);

	return <Box>ACCESS TESTED!</Box>;
};

export default withAuthRequired(TestAuth);
