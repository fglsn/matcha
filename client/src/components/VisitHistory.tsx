//prettier-ignore
import { Alert, Container, Grid, Paper, styled, Typography} from '@mui/material';
import { useServiceCall } from '../hooks/useServiceCall';
import { getVisitHistory } from '../services/stats';
import { useStateValue } from '../state';
import { VisitEntry } from '../types';
import HistoryIcon from '@mui/icons-material/History';
import withProfileRequired from './ProfileRequired';
import LoadingIcon from './LoadingIcon';
import UserList from './UserList';

export const StatisticItem = styled(Paper)(({ theme }) => ({
	height: '750px',
	...theme.typography.body2,
	padding: theme.spacing(4),
	textAlign: 'center',
	color: theme.palette.text.secondary,
	background: 'rgb(250 250 250 / 81%)',
	marginBottom: '2rem'
}));

export const ItemContent = styled(Paper)`
	display: flex;
	padding: 1.5rem;
	margin-top: 2rem;
	height: 85%;
	background-color: ##ffc600db;
	overflow-y: scroll;
`;

const VisitHistory = () => {
	const [{ loggedUser }] = useStateValue();

	const {
		data: visitHistoryData,
		error: visitHistoryError
	}: {
		data: [VisitEntry[], VisitEntry[]] | undefined;
		error: Error | undefined;
	} = useServiceCall(async () => loggedUser && (await getVisitHistory(loggedUser.id)), []);

	if (visitHistoryError)
		return (
			<Alert severity="error">
				Error loading visit history page, please try again...
			</Alert>
		);

	if (!visitHistoryData) {
		return <LoadingIcon />;
	}

	const [visitors, visited] = visitHistoryData;

	return (
		<Container maxWidth="lg" sx={{ mt: 5, mb: 8 }}>
			<Grid
				container
				columnSpacing={{ xs: 2, sm: 3, md: 4, lg: 10 }}
				sx={{
					flexDirection: { xs: 'column', md: 'row' },
					height: '80%',
					justifyContent: 'center',
					alignContent: 'center'
				}}
			>
				<Grid
					sx={{ width: '100%' }}
					maxWidth={{ xs: '100%', sm: '75%', md: '65%', lg: '50%' }}
					flexBasis={{ xs: '100%', sm: '75%', md: '65%', lg: '50%' }}
					item
					xs={12}
					sm={6}
				>
					<StatisticItem>
						<HistoryIcon />
						<Typography variant="h6" style={{ fontWeight: '400' }}>
							Users that visited your profile
						</Typography>
						<ItemContent>
							<UserList
								users={
									visitors
										? visitors.map((entry) => {
												return entry.visitorUserId;
										  })
										: undefined
								}
							/>
						</ItemContent>
					</StatisticItem>
				</Grid>
				<Grid
					sx={{ width: '100%' }}
					maxWidth={{ xs: '100%', sm: '75%', md: '65%', lg: '50%' }}
					flexBasis={{ xs: '100%', sm: '75%', md: '65%', lg: '50%' }}
					item
					xs={12}
					sm={6}
				>
					<StatisticItem>
						<HistoryIcon />
						<Typography variant="h6" style={{ fontWeight: '400' }}>
							Profiles you opened
						</Typography>
						<ItemContent>
							<UserList
								users={
									visited
										? visited.map((entry) => {
												return entry.visitedUserId;
										  })
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

export default withProfileRequired(VisitHistory);
