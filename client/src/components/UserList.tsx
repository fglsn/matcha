//prettier-ignore
import { ListItemButton, ListItemAvatar, Avatar, ListItemText, List, ListItem, Divider } from '@mui/material';
import withAuthRequired from './AuthRequired';

const UserList = () => {
	return (
		<List style={{ width: '100%' }}>
			{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => {
				const labelId = `checkbox-list-secondary-label-${value}`;
				return (
					<>
						<ListItem key={value} disablePadding>
							<ListItemButton>
								<ListItemAvatar>
									<Avatar
										alt={`Avatar n°${value + 1}`}
										src={`/static/images/avatar/${value + 1}.jpg`}
									/>
								</ListItemAvatar>
								<ListItemText
									id={labelId}
									primary={`User ${value + 1}`}
								/>
							</ListItemButton>
						</ListItem>
						<Divider />
					</>
				);
			})}
		</List>
	);
};

export default withAuthRequired(UserList);
