//prettier-ignore
import { Container, Grid, Paper, styled, Typography} from '@mui/material';
import withAuthRequired from './AuthRequired';
import UserList from './UserList';
import HistoryIcon from '@mui/icons-material/History';

export const StatisticItem = styled(Paper)(({ theme }) => ({
	height: '750px',
	backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
	...theme.typography.body2,
	padding: theme.spacing(4),
	textAlign: 'center',
	color: theme.palette.text.secondary,
	background: 'rgb(250 250 250 / 81%)'
}));

export const ItemContent = styled(Paper)`
	display: flex;
	padding: 2rem;
	margin-top: 2rem;
	height: 80%;
	background-color: ##ffc600db;
	overflow-y: scroll;
`;

const VisitHistory = () => {
	return (
		<Container maxWidth="lg" sx={{ mt: 15, mb: 8 }}>
			<Grid
				container
				columnSpacing={{ xs: 2, sm: 3, md: 4, lg: 10 }}
				sx={{ flexDirection: { xs: 'column', sm: 'row' }, height: '80%' }}
			>
				<Grid item xs={12} sm={6}>
					<StatisticItem>
						<HistoryIcon />
						<Typography variant="h6" style={{ fontWeight: '400' }}>
							Users that visited your profile
						</Typography>
						<ItemContent>
							<UserList />
						</ItemContent>
					</StatisticItem>
				</Grid>
				<Grid item xs={12} sm={6}>
					<StatisticItem>
						<HistoryIcon />
						<Typography variant="h6" style={{ fontWeight: '400' }}>
							Profiles you opened
						</Typography>
						<ItemContent>
							<UserList />
						</ItemContent>
					</StatisticItem>
				</Grid>
			</Grid>
		</Container>
	);
};

export default withAuthRequired(VisitHistory);
