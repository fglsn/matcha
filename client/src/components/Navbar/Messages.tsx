import { Badge } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { MessageNotification } from '../../types';
import { AlertContext } from '../AlertProvider';
import { socket } from '../../services/socket';
import IconButton from '@mui/material/IconButton';
import { useServiceCall } from '../../hooks/useServiceCall';
import { getChatNotifications } from '../../services/chats';
import { setMsgNotifications, useStateValue } from '../../state';
import EmailIcon from '@mui/icons-material/Email';
import { useNavigate } from 'react-router';
import { useStateChatReload } from '../ChatReloadProvider';

const ChatButton = () => {
	const alert = useContext(AlertContext);
    const reload = useStateChatReload();
    const navigate = useNavigate();
    const [{ openChats, msgNotifications }, dispatch] = useStateValue();

	const {
		data: NotifQueueData,
		error: NotifQueueError
	}: { data: MessageNotification[] | undefined; error: Error | undefined } = useServiceCall(
		async () => await getChatNotifications(),
		[openChats, reload.reason]
	);
	void NotifQueueError;

	const [initialCount, setInitialCount] = useState<number>(0);

	useEffect(() => {
		if (NotifQueueData) {
            const filteredMsgNotifs = NotifQueueData.filter(item => !openChats.includes(item.matchId));
            dispatch(setMsgNotifications(filteredMsgNotifs));
			setInitialCount(filteredMsgNotifs.length);
            setCounter(0);
		}
	}, [NotifQueueData, dispatch, openChats]);

	const [counter, setCounter] = useState<number>(0);

	useEffect(() => {
		socket.on('chat_notification', (chatNotification) => {
            if (!openChats.includes(chatNotification.matchId)) {
                setCounter((prev) => prev + 1);
                alert.success('You have new message!');
                dispatch(setMsgNotifications([...msgNotifications, chatNotification]))
            }
		});
		return () => {
			socket.off('chat_notification');
		};
	}, [alert, dispatch, msgNotifications, openChats]);

    useEffect(() => {
		socket.on('reload_chat', (matchId) => {
			reload.initReload(matchId);
		});
		return () => {
			socket.off('reload_chat');
		};
	}, [reload]);

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        navigate('/chats');
	};


	return (
		<>
			<Badge
				badgeContent={initialCount + counter}
				max={999}
				anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
				overlap="circular"
				color="error"
			>
				<IconButton
					aria-label="Chats button"
					// id="long-button"
					// aria-controls={open ? 'long-menu' : undefined}
					// aria-expanded={open ? 'true' : undefined}
					// aria-haspopup="true"
					onClick={handleClick}
				>
					<EmailIcon
						fontSize="medium"
						color={NotifQueueData ? 'primary' : 'disabled'}
					/>
				</IconButton>
			</Badge>
		</>
	);
};

export default ChatButton;
