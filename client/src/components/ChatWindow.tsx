import { Link, useNavigate, useParams } from 'react-router-dom';
import LabelImportantIcon from '@mui/icons-material/LabelImportant';
import {
	Avatar,
	Container,
	Grid,
	IconButton,
	Paper,
	styled,
	Typography
} from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { socket } from '../services/socket';
import { AlertContext } from './AlertProvider';
import { Chat, ChatCallback, ChatMsg, UserEntryForChat } from '../types';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useField } from '../hooks/useField';
import { validateMsg, validateMsgForm } from '../utils/inputValidators';
import { setOpenChats, useStateValue } from '../state';
import { useStateChatReload } from './ChatReloadProvider';
import { getChatUsers } from '../services/chats';
import { useServiceCall } from '../hooks/useServiceCall';
import { CallbackSucess, withTimeout } from './PublicProfile/OnlineIndicator';
import CircleIcon from '@mui/icons-material/Circle';
import LoadingIcon from './LoadingIcon';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

type CallbackChatSucess = ChatCallback;
type CallbackChatTimeout = () => void;

export const withTimeoutChat = (
	onSuccess: CallbackChatSucess,
	onTimeout: CallbackChatTimeout,
	timeout: number
) => {
	let called = false;

	const timer = setTimeout(() => {
		if (called) return;
		called = true;
		onTimeout();
	}, timeout);

	return (...args: [Chat]) => {
		if (called) return;
		called = true;
		clearTimeout(timer);
		onSuccess.apply(this, args);
	};
};

const BackgroundPaper = styled(Paper)(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	height: '750px',
	...theme.typography.body2,
	padding: theme.spacing(4),
	textAlign: 'center',
	color: theme.palette.text.secondary,
	background: 'rgb(250 250 250 / 81%)'
}));

const ChatContent = styled(Paper)`
	display: flex;
	margin-top: 0.5rem;
	height: 85%;
	background-color: ##ffc600db;
	overflow: hidden;
`;

const StyledLink = styled(Link)`
	color: rgba(0, 0, 0, 0.6);
	text-decoration: none;
`;

const TextFieldWrapper = styled(TextField)`
	fieldset {
		border-radius: 7px;
	}
`;

const receivedMsg = {
	display: 'flex',
	flexWrap: 'wrap',
	flexDirection: 'row',
	justifyContent: 'flex-start',
	alignItems: 'center',
	textAlign: 'left',
	pr: '50%'
	// maxWidth: '50%'
};

const sentMsg = {
	display: 'flex',
	flexWrap: 'wrap',
	flexDirection: 'row-reverse',
	justifyContent: 'flex-start',
	alignItems: 'center',
	textAlign: 'left',
	pl: '50%'
	// maxWidth: '50%'
};

const MsgBoxStyles = {
	display: 'flex',
	wrap: 'nowrap',
	flexDirection: 'row',
	alignItems: 'flex-end',
	bgcolor: 'primary.main',
	border: 1,
	borderColor: 'secondary.main',
	p: 1,
	borderRadius: '7px'
};

const User = ({ user }: { user: UserEntryForChat }) => {
	const callbackSuccess: CallbackSucess = ({ online, lastActive }) => {
		setOnline(online);
	};

	const callbackTimeout = () => {
		setOnline(false);
	};

	const [online, setOnline] = useState(false);

	// Query online status and get response in callback
	useEffect(() => {
		socket.emit(
			'online_query',
			user.id,
			withTimeout(callbackSuccess, callbackTimeout, 2000)
		);
		const intervalId = setInterval(() => {
			socket.emit(
				'online_query',
				user.id,
				withTimeout(callbackSuccess, callbackTimeout, 2000)
			);
		}, 60000);
		return () => clearInterval(intervalId);
	}, [user.id]);

	return (
		<StyledLink to={`/profile/${user.id}`}>
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'nowrap',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Avatar alt={`Avatar of user ${user.username}`} src={`${user.avatar}`} />
                <Typography variant="h6" style={{ fontWeight: '400' }}>
                    {`${user.firstname}, ${user.age}`}
                </Typography>
                {online ? (
                    <CircleIcon sx={{ fontSize: 15, marginLeft: 1 }} color="success" />
                ) : (
                    ''
                )}
            </Box>
        </StyledLink>
	);
};

const Messages = ({
	messages,
	users,
	userId
}: {
	messages: ChatMsg[];
	users: UserEntryForChat[];
	userId: string;
}) => {
	const [sender] = users.filter((user) => user.id === userId);
	const [receiver] = users.filter((user) => user.id !== userId);

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column-reverse',
				width: '100%',
				overflowY: 'auto',
				p: 1
			}}
		>
			{messages.map((msg, i) =>
				msg.receiver_id === userId ? (
					<Box sx={receivedMsg} key={i}>
						{/* <Avatar alt={`Avatar of user ${sender.username}`} src={`${sender.avatar}`} /> */}
						<Box
							sx={{
								...MsgBoxStyles
							}}
						>
							<Typography
								color="secondary"
								variant="body2"
								sx={{ mx: 1 }}
							>{`${msg.message_text} `}</Typography>
							<Typography color="grey" sx={{ fontSize: '0.6rem' }}>
								{dayjs(msg.message_time).format('HH:mm')}
							</Typography>
						</Box>
					</Box>
				) : (
					<Box sx={sentMsg} key={i}>
						{/* <Avatar alt={`Avatar of user ${receiver.username}`} src={`${receiver.avatar}`} /> */}
						<Box
							sx={{
								...MsgBoxStyles
							}}
						>
							<Typography
								color="secondary"
								variant="body2"
								sx={{ mx: 1 }}
							>{`${msg.message_text} `}</Typography>
							<Typography color="grey" sx={{ fontSize: '0.6rem' }}>
								{dayjs(msg.message_time).format('HH:mm')}
							</Typography>
						</Box>
					</Box>
				)
			)}
		</Box>
	);
};

const MsgFormStyles = {
	display: 'flex',
	maxWidth: '100%',
	flexWrap: 'nowrap',
	alignItems: 'stretch',
	my: 1.4
};

const ChatWindow = () => {
	const { id } = useParams();
	const [{ openChats, loggedUser }, dispatch] = useStateValue();
	const alert = useContext(AlertContext);
	const navigate = useNavigate();
	const [messages, setMessages] = useState<ChatMsg[]>([]);
	const newMSG = useField('text', 'Message', validateMsg);
	const reload = useStateChatReload();

	const {
		data: chatUsers,
		error: chatUsersError
	}: {
		data: UserEntryForChat[] | undefined;
		error: Error | undefined;
	} = useServiceCall(async () => id && (await getChatUsers(id)), [id]);

	const callbackSuccess: ChatCallback = ({ messages: initialMsgs }) => {
		setMessages(initialMsgs);
	};

	const handleSubmit = async (event: any) => {
		event.preventDefault();
		if (id) {
			const event = {
				target: {
					value: ''
				}
			};
			socket.emit('send_message', id, newMSG.value);
			newMSG.onChange(event);
		}
	};

	useEffect(() => {
		console.log('setting uf');

		const callbackTimeout: CallbackChatTimeout = () => {
			alert.error('Failed to load chat');
			navigate('/chats');
		};

		if (id) {
			dispatch(setOpenChats([id, ...openChats]));
			socket.emit(
				'active_chat',
				id,
				withTimeoutChat(callbackSuccess, callbackTimeout, 5000)
			);
		}

		if (chatUsersError) callbackTimeout();
		return () => {
			if (id) socket.emit('clear_chat_notifications', id);
			dispatch(setOpenChats(openChats.filter((chatId) => chatId !== id)));
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id, navigate, chatUsersError]);

	useEffect(() => {
		socket.on('receive_message', (message) => {
			setMessages((prev) => {
				return [message, ...prev];
			});
		});

		return () => {
			socket.off('receive_message');
		};
	}, [id]);

	useEffect(() => {
		if (id) {
			if (reload.reason === id) navigate('/chats');
		}
	}, [id, navigate, reload.reason]);

	if (!chatUsers || !loggedUser) {
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
					<BackgroundPaper>
						{/* <LoyaltyIcon /> */}
						<User
							user={
								chatUsers.filter((user) => user.id !== loggedUser.id)[0]
							}
						/>
						<ChatContent>
							<Messages
								messages={messages}
								users={chatUsers}
								userId={loggedUser.id}
							/>
						</ChatContent>
						<Box
							component="form"
							noValidate
							autoComplete="off"
							sx={{
								...MsgFormStyles
							}}
							onSubmit={handleSubmit}
						>
							<TextFieldWrapper
								{...{ ...newMSG, error: false, helperText: undefined }}
								fullWidth
								autoFocus
								multiline
								maxRows={4}
								sx={{ borderRadius: '7px' }}
							/>

							{validateMsgForm(newMSG.value) ? (
								<IconButton
									color="primary"
									type="submit"
									sx={{
										border: 2,
										borderColor: 'primary.main',
										borderRadius: '7px',
										ml: 1
									}}
								>
									<LabelImportantIcon />
								</IconButton>
							) : (
								<IconButton
									type="submit"
									disabled
									sx={{
										border: 1,
										borderColor: 'text.grey',
										borderRadius: '7px',
										ml: 1
									}}
								>
									<LabelImportantIcon />
								</IconButton>
							)}
						</Box>
					</BackgroundPaper>
				</Grid>
			</Grid>
		</Container>
	);
};

export default ChatWindow;
