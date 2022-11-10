import { CircularProgress, Stack } from '@mui/material';

const LoadingIcon = () => {
	return (
		<Stack alignItems="center">
			<CircularProgress style={{ margin: '10rem' }} />
		</Stack>
	);
};

export default LoadingIcon;
