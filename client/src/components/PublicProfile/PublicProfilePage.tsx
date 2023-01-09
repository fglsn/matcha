import withProfileRequired from '../ProfileRequired';
import { useParams } from 'react-router';
import { useServiceCall } from '../../hooks/useServiceCall';
import { getPublicProfile } from '../../services/profile';
import { ProfilePublic } from '../../types';
import { Alert } from '@mui/material';
import PublicProfile from '.';
import LoadingIcon from '../LoadingIcon';

const PublicProfilePage = () => {
	const { id } = useParams();

	const {
		data: profileData,
		error: profileError
	}: { data: ProfilePublic | undefined; error: Error | undefined } = useServiceCall(
		async () => id && (await getPublicProfile(id)),
		[id]
	);

	if (profileError) {
		return <Alert severity="error">Error loading profile page, please try again...</Alert>;
	}

	if (!profileData) {
		return <LoadingIcon />;
	}

	return <PublicProfile profileData={profileData} />;
};

export default withProfileRequired(PublicProfilePage);
