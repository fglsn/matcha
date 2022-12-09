//prettier-ignore
import { Container, Grid, Paper, styled, Typography} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Diversity1Icon from '@mui/icons-material/Diversity1';
import withAuthRequired from './AuthRequired';
import UserList from './UserList';

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
	height: 90%;
	background-color: ##ffc600db;
	overflow-y: scroll;
`;

const Likes = () => {
	return (
		<Container maxWidth="lg" sx={{ mt: 15, mb: 8 }}>
			<Grid
				container
				columnSpacing={{ xs: 2, sm: 3, md: 4, lg: 10 }}
				sx={{ flexDirection: { xs: 'column', sm: 'row' }, height: '80%' }}
			>
				<Grid item xs={12} sm={6}>
					<StatisticItem>
						<FavoriteBorderIcon />
						<Typography variant="h6" style={{ fontWeight: '400' }}>
							Who liked you
						</Typography>
						<ItemContent>
							<UserList />
						</ItemContent>
					</StatisticItem>
				</Grid>
				<Grid item xs={12} sm={6}>
					<StatisticItem>
						<Diversity1Icon />
						<Typography variant="h6" style={{ fontWeight: '400' }}>
							Whom you liked
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

export default withAuthRequired(Likes);
