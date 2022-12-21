//prettier-ignore
import { Alert, Container, Grid, Paper, styled, Typography} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Diversity1Icon from '@mui/icons-material/Diversity1';
import withProfileRequired from './ProfileRequired';
import UserList from './UserList';
import { useServiceCall } from '../hooks/useServiceCall';
import { getLikes } from '../services/stats';
import { useStateValue } from '../state';
import { LikeEntry } from '../types';
import LoadingIcon from './LoadingIcon';

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

const Likes = () => {
	const [{ loggedUser }] = useStateValue();

	const {
		data: likesData,
		error: likesError
	}: {
		data: [LikeEntry[], LikeEntry[]] | undefined;
		error: Error | undefined;
	} = useServiceCall(async () => loggedUser && (await getLikes(loggedUser.id)), []);

	if (likesError)
		return (
			<Alert severity="error">
				Error loading visit history page, please try again...
			</Alert>
		);

	if (!likesData) {
		return <LoadingIcon />;
	}

	const [likesBy, likesFrom] = likesData;

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
						<FavoriteBorderIcon />
						<Typography variant="h6" style={{ fontWeight: '400' }}>
							Who liked you
						</Typography>
						<ItemContent>
							<UserList
								users={
									likesBy
										? likesBy.map((entry) => {
												return entry.likingUserId;
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
						<Diversity1Icon />
						<Typography variant="h6" style={{ fontWeight: '400' }}>
							Whom you liked
						</Typography>
						<ItemContent>
							<UserList
								users={
									likesFrom
										? likesFrom.map((entry) => {
												return entry.likedUserId;
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

export default withProfileRequired(Likes);
