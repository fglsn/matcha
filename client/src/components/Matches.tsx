//prettier-ignore
import { Alert, Container, Grid, Paper, styled, Typography} from '@mui/material';
import withProfileRequired from './ProfileRequired';
import UserList from './UserList';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import { MatchEntry } from '../types';
import { getMatches } from '../services/stats';
import { useStateValue } from '../state';
import { useServiceCall } from '../hooks/useServiceCall';
import LoadingIcon from './LoadingIcon';

export const StatisticItem = styled(Paper)(({ theme }) => ({
	height: '750px',
	...theme.typography.body2,
	padding: theme.spacing(4),
	textAlign: 'center',
	color: theme.palette.text.secondary,
	background: 'rgb(250 250 250 / 81%)'
}));

export const ItemContent = styled(Paper)`
	display: flex;
	padding: 1.5rem;
	margin-top: 2rem;
	height: 85%;
	background-color: ##ffc600db;
	overflow-y: scroll;
`;

const Matches = () => {
	const [{ loggedUser }] = useStateValue();

	const {
		data: matchesData,
		error: matchesError
	}: {
		data: MatchEntry[] | undefined;
		error: Error | undefined;
	} = useServiceCall(async () => loggedUser && (await getMatches(loggedUser.id)), []);

	if (matchesError)
		return (
			<Alert severity="error">
				Error loading visit history page, please try again...
			</Alert>
		);

	if (!matchesData) {
		return <LoadingIcon />;
	}

	return (
		<Container maxWidth="lg" sx={{ mt: 5, mb: 8 }}>
			<Grid
				container
				columnSpacing={{ xs: 2, sm: 3, md: 4, lg: 10 }}
				sx={{
					flexDirection: { xs: 'column', sm: 'row' },
					height: '80%',
					justifyContent: 'center'
				}}
			>
				<Grid item xs={12} sm={6}>
					<StatisticItem>
						<LoyaltyIcon />
						<Typography variant="h6" style={{ fontWeight: '400' }}>
							Matches
						</Typography>
						<ItemContent>
							<UserList
								users={
									matchesData
										? matchesData
										.flatMap((entry) => {
												return [entry.matchedUserIdOne, entry.matchedUserIdTwo]
										})
										.filter((id) => loggedUser?.id !== id)
										: undefined
								}
							/>
						</ItemContent>
					</StatisticItem>
				</Grid>
			</Grid>
		</Container>
	);
};

export default withProfileRequired(Matches);
