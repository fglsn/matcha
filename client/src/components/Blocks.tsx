//prettier-ignore
import { Alert, Container, Grid, Paper, styled, Typography} from '@mui/material';
import withAuthRequired from './AuthRequired';
import UserList from './UserList';
import BlockIcon from '@mui/icons-material/Block';
import { useServiceCall } from '../hooks/useServiceCall';
import { getBlocks } from '../services/stats';
import { useStateValue } from '../state';
import { BlockEntry } from '../types';
import LoadingIcon from './LoadingIcon';

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
	height: 85%;
	background-color: ##ffc600db;
	overflow-y: scroll;
`;

const Blocks = () => {
	const [{ loggedUser }] = useStateValue();

	const {
		data: blocksData,
		error: blocksError
	}: {
		data: BlockEntry[] | undefined;
		error: Error | undefined;
	} = useServiceCall(async () => loggedUser && (await getBlocks(loggedUser.id)), []);

	if (blocksError)
		return (
			<Alert severity="error">
				Error loading visit history page, please try again...
			</Alert>
		);

	if (!blocksData) {
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
						<BlockIcon />
						<Typography variant="h6" style={{ fontWeight: '400' }}>
							Removed from search list
						</Typography>
						<ItemContent>
							<UserList
								users={
									blocksData
										? blocksData.map((entry) => {
												return entry.blockedUserId;
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

export default withAuthRequired(Blocks);
