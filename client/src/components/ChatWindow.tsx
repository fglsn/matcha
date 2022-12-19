import { useNavigate, useParams } from 'react-router-dom';
import LabelImportantIcon from '@mui/icons-material/LabelImportant';
import { IconButton } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { socket } from '../services/socket';
import { AlertContext } from './AlertProvider';
import { Chat, ChatCallback, ChatMsg } from '../types';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useField } from '../hooks/useField';
import { validateMsg, validateMsgForm } from '../utils/inputValidators';
import { setOpenChats, useStateValue } from '../state';
import { useStateChatReload } from './ChatReloadProvider';

type CallbackSucess = ChatCallback;
type CallbackTimeout = () => void;

export const withTimeout = (
	onSuccess: CallbackSucess,
	onTimeout: CallbackTimeout,
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

const ChatWindow = () => {
	const { id } = useParams();
    const [{openChats}, dispatch] = useStateValue();
	const alert = useContext(AlertContext);
	const navigate = useNavigate();
	const [messages, setMessages] = useState<ChatMsg[]>([]);
	const newMSG = useField('text', 'Message', validateMsg);
    const reload = useStateChatReload();


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
        const callbackTimeout: CallbackTimeout = () => {
            alert.error('Failed to load chat');
            navigate('/chats');
        };

		if (id) {
            dispatch(setOpenChats([id, ...openChats]));
            socket.emit(
				'active_chat',
				id,
				withTimeout(callbackSuccess, callbackTimeout, 5000)
			);
		}

		return () => {
            if (id) socket.emit('clear_chat_notifications', id);
			dispatch(setOpenChats(openChats.filter(chatId => chatId !== id)));
		};
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id, navigate]);

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

	return (
		<>
			Chat id: {id}
			<Box
				component="form"
				noValidate
				sx={{
					width: 500,
					maxWidth: '100%'
				}}
				onSubmit={handleSubmit}
			>
				<TextField {...newMSG} fullWidth autoFocus />

				{validateMsgForm(newMSG.value) ? (
					<IconButton color="primary" type="submit">
						<LabelImportantIcon />
					</IconButton>
				) : (
					<IconButton type="submit" disabled>
						<LabelImportantIcon />
					</IconButton>
				)}
			</Box>
			{messages.map((msg, i) => (
				<p key={i}>{msg.message_text}</p>
			))}
		</>
	);
};

export default ChatWindow;
