//prettier-ignore
import { ListItemButton, ListItemAvatar, Avatar, ListItemText, List, ListItem, Divider, Typography, Alert, styled } from '@mui/material';
import { useServiceCall } from '../hooks/useServiceCall';
import { getUserEntries } from '../services/stats';
import { Link } from 'react-router-dom';
import { UserEntry } from '../types';
import withAuthRequired from './AuthRequired';

export const StyledLink = styled(Link)`
	color: rgba(0, 0, 0, 0.6);
	text-decoration: none;
`;

const User = ({ user }: { user: UserEntry }) => {
	return (
		<>
			<StyledLink to={`/profile/${user.id}`}>
				<ListItem disablePadding>
					<ListItemButton>
						<ListItemAvatar>
							<Avatar
								alt={`Avatar of user ${user.username}`}
								src={`${user.avatar}`}
							/>
						</ListItemAvatar>
						<ListItemText primary={user.username} />
					</ListItemButton>
				</ListItem>
			</StyledLink>
			<Divider />
		</>
	);
};

const UserList: React.FC<{
	users: string[] | undefined;
}> = ({ users: idList }) => {
	const {
		data: userEntriesData,
		error: userEntriesError
	}: {
		data: UserEntry[];
		error: Error | undefined;
	} = useServiceCall(async () => idList && (await getUserEntries(idList)), []);

	if (userEntriesError)
		return (
			<Alert severity="error">Error loading user list, please try again...</Alert>
		);

	if (!userEntriesData || !userEntriesData.length) {
		return (
			<Typography variant="h6" color="rgba(0, 0, 0, 0.6)" textAlign="center">
				No history yet
			</Typography>
		);
	}

	return (
		userEntriesData && (
			<List style={{ width: '100%' }}>
				{userEntriesData.map((value) => (
					<User key={value.id} user={value} />
				))}
			</List>
		)
	);
};

export default withAuthRequired(UserList);
