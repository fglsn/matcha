import { useNavigate, useParams } from 'react-router-dom';
import LabelImportantIcon from '@mui/icons-material/LabelImportant';
import {
	Container,
	Grid,
	IconButton,
	Paper,
	styled} from '@mui/material';
import { FormEvent, useContext, useEffect, useRef, useState } from 'react';
import { socket } from '../../services/socket';
import { AlertContext } from '../AlertProvider';
import { Chat, ChatCallback, ChatMsg, UserEntryForChat } from '../../types';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useField } from '../../hooks/useField';
import { validateMsg, validateMsgForm } from '../../utils/inputValidators';
import { setOpenChats, useStateValue } from '../../state';
import { useStateChatReload } from './ChatReloadProvider';
import { getChatUsers } from '../../services/chats';
import { useServiceCall } from '../../hooks/useServiceCall';
import LoadingIcon from '../LoadingIcon';
import Messages from './Messages';
import User from './UserBar';

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

const TextFieldWrapper = styled(TextField)`
	fieldset {
		border-radius: 7px;
	}
`;

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
	const buttonRef = useRef<HTMLButtonElement | null>(null);

	const {
		data: chatUsers,
		error: chatUsersError
	}: {
		data: UserEntryForChat[] | undefined;
		error: Error | undefined;
	} = useServiceCall(async () => id && (await getChatUsers(id)), [id]);

	const callbackSuccess: ChatCallback = ({ messages: initialMsgs }) => {
		void initialMsgs;
		// setMessages([]);
		console.log('active chat success');
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
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
		const listener = (event: KeyboardEvent) => {
			if (
				((event.code === 'Enter' && event.shiftKey) ||
					(event.code === 'NumpadEnter' && event.shiftKey)) &&
				buttonRef.current
			) {
				event.preventDefault();
				buttonRef.current.click();
			}
		};
		document.addEventListener('keydown', listener);
		return () => {
			document.removeEventListener('keydown', listener);
		};
	}, []);

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
				const arr = [message, ...prev];
				return arr.filter(
					(value, index, self) =>
						index === self.findIndex((m) => m.message_id === value.message_id)
				);
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

	if (!chatUsers || !loggedUser || !id) {
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
								setMessages={setMessages}
								matchId={id}
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
									ref={buttonRef}
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
