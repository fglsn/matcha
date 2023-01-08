//prettier-ignore
import { Alert, Avatar, Badge, Box, Container, Divider, Grid, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Paper, styled, Typography} from '@mui/material';
import withProfileRequired from './ProfileRequired';
import { ChatHeader, ChatMsg, UserEntryForChat } from '../types';
import { useServiceCall } from '../hooks/useServiceCall';
import LoadingIcon from './LoadingIcon';
import { Link } from 'react-router-dom';
import { getChats } from '../services/chats';
import CircleIcon from '@mui/icons-material/Circle';
import { useEffect, useState } from 'react';
import { CallbackSucess, withTimeout } from './PublicProfile/OnlineIndicator';
import { socket } from '../services/socket';
import { useStateValue } from '../state';
import { useStateChatReload } from './ChatWindow/ChatReloadProvider';
import InboxIcon from '@mui/icons-material/Inbox';

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

export const StyledLink = styled(Link)`
	color: rgba(0, 0, 0, 0.6);
	text-decoration: none;
`;

const User = ({ user, matchId, lastMsg }: { user: UserEntryForChat, matchId: string, lastMsg: ChatMsg }) => {
	
    const getMessageCut = () => {
        if (!lastMsg) 
            return 'New Match, Say Hello!';

        if (lastMsg.message_text.length > 45) {
            const string = lastMsg.message_text.slice(0,45);
            const substrings = string.split(' ');
            const stringCut = substrings.length === 1 
            ? string
            : substrings.slice(0, -1).join(' ');
            return `${stringCut}...`;
        }
       
        return lastMsg.message_text;
    }

    const callbackSuccess: CallbackSucess = ({online, lastActive}) => {
		setOnline(online);
	};

    const callbackTimeout = () => {
		setOnline(false);
	};

	const [online, setOnline] = useState(false);
    const [{ msgNotifications }] = useStateValue();

    // Query online status and get response in callback
	useEffect(() => {
		socket.emit('online_query', user.id, withTimeout(callbackSuccess, callbackTimeout, 2000));
		const intervalId = setInterval(() => {
			socket.emit('online_query', user.id, withTimeout(callbackSuccess, callbackTimeout, 2000));
		}, 60000);
		return () => clearInterval(intervalId);
	}, [user.id]);


    const counter = msgNotifications.filter(msg => msg.matchId === matchId).length;
    // const [counter, setCounter] = useState<number>(0);
    
    return (
		<>

			<StyledLink to={`/chats/${matchId}`}>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemAvatar>
                            <Badge
                                badgeContent={counter}
                                max={999}
                                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                                // overlap="circular"
                                color="error"
			                >
                                <Avatar
                                    alt={`Avatar of user ${user.username}`}
                                    src={`${user.avatar}`}
                                />
                            </Badge>
                        </ListItemAvatar>
                        <ListItemText
                            primary={
                                <Box  sx={{ display: 'flex', flexWrap: 'nowrap', alignItems: 'center' }}>
                                {`${user.firstname}, ${user.age}`}
                                {online ? <CircleIcon sx={{ fontSize: 15, marginLeft: 1 }} color="success" /> : ''}
                                </Box>
                            }
                            secondary={
                                <>
                                    {/* <Typography
                                        sx={{ display: 'inline' }}
                                        component="span"
                                        variant="body2"
                                        color="text.primary"
                                    >
                                        to Scott, Alex, Jennifer
                                    </Typography> */}
                                    {` - ${getMessageCut()}`}
                                </>
                            }
                        />
                    </ListItemButton>
                </ListItem>
            </StyledLink>
			<Divider />
		</>
	);
};

const ChatList: React.FC<{
	chatEntries: ChatHeader[] | undefined;
}> = ({ chatEntries }) => {

	if (!chatEntries || !chatEntries.length) {
		return (
			<Typography variant="h6" color="rgba(0, 0, 0, 0.6)" textAlign="center">
				No chats yet
			</Typography>
		);
	}

	return (
		chatEntries && (
			<List style={{ width: '100%' }}>
				{chatEntries.map((entry) => (
					<User key={entry.matchId} user={entry.matchedUser} matchId={entry.matchId} lastMsg={entry.lastMessage} />
				))}
			</List>
		)
	);
};

const Chats = () => {
    const [{ msgNotifications }] = useStateValue();
    const reload = useStateChatReload();
	
    const {
		data: chatsData,
		error: chatsError
	}: {
		data: ChatHeader[] | undefined;
		error: Error | undefined;
	} = useServiceCall(async () => await getChats(), [msgNotifications, reload.reason]);

	if (chatsError)
		return (
			<Alert severity="error">
				Error loading chats history page, please try again...
			</Alert>
		);

	if (!chatsData) {
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
						<InboxIcon />
						<Typography variant="h6" style={{ fontWeight: '400' }}>
							Chats
						</Typography>
						<ItemContent>
							<ChatList chatEntries={chatsData} />
						</ItemContent>
					</StatisticItem>
				</Grid>
			</Grid>
		</Container>
	);
};

export default withProfileRequired(Chats);