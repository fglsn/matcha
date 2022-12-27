//prettier-ignore
import { Alert, Container, Grid, Paper, styled, Typography} from '@mui/material';
import BlockIcon from '@mui/icons-material/Block';
import { useServiceCall } from '../hooks/useServiceCall';
import { getBlocks } from '../services/stats';
import { useStateValue } from '../state';
import { BlockEntry } from '../types';
import withProfileRequired from './ProfileRequired';
import LoadingIcon from './LoadingIcon';
import UserList from './UserList';

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
					flexDirection: { xs: 'column' },
					height: '80%',
					justifyContent: 'center',
					alignContent: 'center'
				}}
			>
				<Grid
					sx={{ width: '100%' }}
					maxWidth={{ xs: '100%', sm: '75%', md: '65%', lg: '50%' }}
					flexBasis="100%"
					item
					xs={12}
					sm={6}
				>
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

export default withProfileRequired(Blocks);
