import { Paper, styled, Container, Grid, Alert } from '@mui/material';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useServiceCall } from '../../hooks/useServiceCall';
import { getAccountPage } from '../../services/account';
import { logoutUser } from '../../services/logout';
import { useStateValue } from '../../state';
import { AuthError } from '../../utils/errors';
import { UserDataWithoutId } from '../../types';
import { AlertContext } from '../AlertProvider';
import withAuthRequired from '../AuthRequired';
import LoadingIcon from '../LoadingIcon';
import ChangeEmail from './ChangeEmail';
import BasicInfo from './BasicInfoSection';
import PicturesSection from './PicturesSection';

const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
	...theme.typography.body2,
	padding: theme.spacing(2),
	textAlign: 'left',
	color: theme.palette.text.secondary
}));

const Account = () => {
	const { error: errorCallback } = useContext(AlertContext);
	const [{ loggedUser }, dispatch] = useStateValue();
	const navigate = useNavigate();

	const {
		data,
		error
	}: { data: UserDataWithoutId | undefined; error: Error | undefined } = useServiceCall(
		async () => loggedUser && (await getAccountPage(loggedUser)),
		[loggedUser]
	);

	useEffect(() => {
		if (error) {
			if (error instanceof AuthError) {
				logoutUser(dispatch);
				errorCallback(error.message);
				navigate('/login');
			}
		}
	}, [dispatch, error, errorCallback, navigate]);


	if (error)
		return (
			<Alert severity="error">
				Error loading account settings page, please try again...
			</Alert>
		);

	if (!data) return <LoadingIcon />;

	const userData: UserDataWithoutId = {
		username: data.username,
		firstname: data.firstname,
		lastname: data.lastname,
		birthday: data.birthday,
		gender: data.gender,
		orientation: data.orientation,
		tags: data.tags,
		bio: data.bio
	};

	return (
		<>
			<Container maxWidth="lg" sx={{ mt: 8 }}>
				<ChangeEmail />
				<Grid
					container
					columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 10 }}
					sx={{ flexDirection: { xs: 'column', sm: 'row' } }}
				>
					<Grid item xs={12} sm={6}>
						<Item>
							<BasicInfo userData={userData} />
						</Item>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Item>
							<PicturesSection userData={userData} />
						</Item>
					</Grid>
				</Grid>
			</Container>
		</>
	);
};

export default withAuthRequired(Account);
